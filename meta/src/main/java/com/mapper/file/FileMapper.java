package com.mapper.file;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FileMapper {

	public int fileCreate(Map<String, Object> param);	

	public List<Map<String, String>> fileRead(Map<String, Object> param);

	public void fileDeleteUpdate(Map<String, Object> param);

	public int fileDelete(Map<String, Object> param);

	public int fileCount(Map<String, Object> param);

}
