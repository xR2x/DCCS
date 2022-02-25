package com.mapper.front;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FrontMapper {
	public List<Map<String, String>> systemMenu(Map<String, Object> param);

	public List<Map<String, String>> userLogin(Map<String, Object> param);
}
