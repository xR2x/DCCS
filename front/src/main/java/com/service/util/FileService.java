package com.service.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Iterator;
import lombok.RequiredArgsConstructor;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.io.FileUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.mapper.util.FileMapper;

@Service
public class FileService {
	@Value("${file.path}")
	private String uploadPath;
	private static final Logger log = LogManager.getLogger(FileService.class);
	@Autowired
	private FileMapper mapper;

    public Map<String,Object> fileUpload(Map<String, Object> param, MultipartHttpServletRequest files) {

		Map<String,Object> data = new HashMap<String,Object>();
		try{
			log.info(param);
			log.info(uploadPath);
			Iterator<String> iter = files.getFileNames(); 
			String fieldName = "";
			MultipartFile file = null;
			while (iter.hasNext()) { 
				fieldName = (String) iter.next();
				file = files.getFile(fieldName);
				File targetFile = new File(uploadPath + file.getOriginalFilename());
//				FileUtils.copyInputStreamToFile(file.getInputStream(), targetFile);
//				log.info(mfile.getOriginalFilename());
			}
		}catch (Exception e){
			data.put("error", e.toString());
		}
        return data;
        
    }

}
