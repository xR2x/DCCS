package com.mapper.login;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LoginMapper {
	public List<Map<String, String>> systemMenu(Map<String, Object> param);

	public List<Map<String, String>> userLogin(Map<String, Object> param);
}
