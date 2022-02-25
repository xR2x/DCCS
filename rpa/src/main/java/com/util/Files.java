package com.util;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.Random;
import java.util.Iterator;
import java.io.File;
import java.text.SimpleDateFormat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.mapper.file.FileMapper;

@Component
public class Files {
	@Value("${file.path}")
	private String uploadRootPath;

	private static final Logger log = LogManager.getLogger(Files.class);

	@Autowired
	private FileMapper mapper;

    public Files(){
    }

    @Transactional
	public Map<String,Object> upload(Map<String, Object> param, MultipartHttpServletRequest files) throws Exception{
    	Map<String,Object> data = new HashMap<String,Object>();
    	try {
			Iterator<String> iter = files.getFileNames();
			SimpleDateFormat time = new SimpleDateFormat("yyyyMM");
			long currentTime = System.currentTimeMillis();
			String tempDate = time.format(new Date(currentTime));

			int i=0;
			while (iter.hasNext()) { 
				MultipartFile file = files.getFile((String)iter.next());
				String uploadPath = param.get("path"+i) + tempDate + "/";

				String ext = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".") + 1);
				String fileName = makeFileName() + "." + ext;

				File targetFile = new File(uploadRootPath + uploadPath + fileName);
				FileUtils.copyInputStreamToFile(file.getInputStream(), targetFile);
				param.put("company",param.get("company"));
				param.put("file_server_name",fileName);
				param.put("file_original_name",file.getOriginalFilename());
				param.put("file_path",uploadPath);
				param.put("file_size",file.getSize());
				param.put("file_type",ext);
				param.put("file_target_seq",param.get("file_target_seq"));
				param.put("file_target_name",param.get("targetName"+i));
				param.put("user_id","admin");
				mapper.fileCreate(param); 
				log.info(param);
				i++;
			}

		}catch(Exception e){
			log.info(e);
			data.put("error", e.toString());
			throw e;
		}
		return data;
	}

	public Map<String,Object> read(Map<String, Object> param) throws Exception{
    	Map<String,Object> data = new HashMap<String,Object>();
    	try {
			if(param.get("attachTargetName") != null){
				List<String> targetNameParam = new ArrayList<String>();
				String attachTargetName = (String)param.get("attachTargetName");
				if(attachTargetName.indexOf(",") > -1){
					String targetNames[] = attachTargetName.split(",");
					for(int i=0;i<targetNames.length;i++){
						targetNameParam.add(targetNames[i]);
					}
				}else{
					targetNameParam.add(attachTargetName);
				}
				param.put("attachTargetNames",targetNameParam);
			}
			List<Map<String, String>> result = mapper.fileRead(param);
			data.put("files",result);
		}catch(Exception e){
			log.info(e);
			data.put("error", e.toString());
			throw e;
		}
		return data;
	}

    @Transactional
	public Map<String,Object> delete(Map<String, Object> param) throws Exception{
    	Map<String,Object> data = new HashMap<String,Object>();
    	try {
			if(param.containsKey("delFiles")) {
				ObjectMapper objectMapper = new ObjectMapper();
				List<?> delFiles = objectMapper.readValue(param.get("delFiles")+"", List.class);
				List<Map<String, String>> list = null;
				for(int i=0;i<delFiles.size();i++){
					param.put("file_seq",delFiles.get(i));
					if(param.get("attachDelete") != null){
						if(param.get("attachDelete").equals("delete")){
						list = mapper.fileRead(param);
						if(list.size() > 0){
							mapper.fileDelete(param);
							Map map = (Map)list.get(0);
							File file = new File(uploadRootPath+map.get("file_path")+"/"+map.get("file_server_name"));
							file.delete();
						}

						}else if(param.get("attachDelete").equals("update")){
							mapper.fileDeleteUpdate(param);
						}
					}
				}
			}
		}catch(Exception e){
			log.info(e);
			data.put("error", e.toString());
			throw e;			
		}
		return data;
	}

	public void copy(Map<String, Object> param) throws Exception{

    	try {
										   
			List<String> delFiles = null;

			if(param.containsKey("delFiles")) {
				ObjectMapper objectMapper = new ObjectMapper();
				delFiles = objectMapper.readValue(param.get("delFiles")+"", List.class);
			}

			SimpleDateFormat time = new SimpleDateFormat("yyyyMM");
			long currentTime = System.currentTimeMillis();
			String tempDate = time.format(new Date(currentTime));

			List<Map<String, String>> result = mapper.fileRead(param);
			if(result != null) {				 
				for(int i=0; i<result.size(); i++) {

					Map map = (Map)result.get(i);

					boolean check = true;

					if(delFiles != null) {
					 	for(String seq : delFiles) {		 
							if((map.get("seq")+"").equals(seq)) {
								check = false;
								break;
							}								 
						}
					}
					
					if(check) {

						File targetFile = new File(uploadRootPath + map.get("file_path") + map.get("file_server_name"));

						if(targetFile.isFile()) {																		

							String fileName = makeFileName() + "." + map.get("file_type");			   
							File copyFile = new File(uploadRootPath + map.get("file_path") + fileName);							
							FileUtils.copyFile(targetFile, copyFile);

							Map fileParam = new HashMap();
							fileParam.putAll(map);
							fileParam.put("user_id", param.get("user_id"));
							fileParam.put("file_server_name", fileName);
							fileParam.put("file_target_seq", param.get("file_copy_seq"));
							mapper.fileCreate(fileParam);
						}
					}
				}
			}
		}catch(Exception e){
			log.info(e);
			throw e;
		}
	}  

	public static String makeFileName(){
		String fileName = "";
		try{
			String rand = "";
			int d = 0;
			for (int i = 0; i < 5; i++){
				Random r = new Random();
				d = r.nextInt(9);
				rand = rand + Integer.toString(d);
			}
			long time = System.currentTimeMillis();
			SimpleDateFormat format = new SimpleDateFormat("mmssSSS");
			fileName = format.format(new Date(time))+""+rand;
		}catch(Exception e){
		}
		return fileName;
	}



}
