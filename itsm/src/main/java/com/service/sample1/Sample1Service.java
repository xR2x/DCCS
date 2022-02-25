package com.service.sample1;

import java.util.HashMap;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mapper.sample1.Sample1Mapper;

@Service
public class Sample1Service {

	private static final Logger log = LogManager.getLogger(Sample1Service.class);
	
	@Autowired
	private Sample1Mapper mapper;

    public Map<String, Object> read(Map<String, Object> param) {
        // TODO Auto-generated method stub
        return null;
    }

    @Transactional
    public Map<String, Object> create(Map<String, Object> param) {
        // TODO Auto-generated method stub
        return null;
    }

    @Transactional
    public Map<String, Object> update(Map<String, Object> param) {
        // TODO Auto-generated method stub
        return null;
    }

    @Transactional
    public Map<String, Object> delete(Map<String, Object> param) {
        // TODO Auto-generated method stub
        return null;
    }

}
