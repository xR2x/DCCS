package com.controller.sample1;

import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.service.sample1.Sample1Service;

import org.springframework.web.bind.annotation.RequestMapping;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/sample1")
public class Sample1Controller {

	private static final Logger log = LogManager.getLogger(Sample1Controller.class);
	
	@Autowired
	private Sample1Service service;
	
	@PostMapping("/read")
    public ResponseEntity<Map<String, Object>> read(@RequestParam Map<String, Object> param) {
        Map<String, Object> data = service.read(param);
        return new ResponseEntity<Map<String, Object>>(data, HttpStatus.OK);        
	}

	@PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@RequestParam Map<String, Object> param) {	
		Map<String,Object> data = service.create(param);				
        return new ResponseEntity<Map<String, Object>>(data, HttpStatus.OK);        
	}

	@PostMapping("/update")
    public ResponseEntity<Map<String, Object>> update(@RequestParam Map<String, Object> param) {	
		Map<String,Object> data = service.update(param);				
        return new ResponseEntity<Map<String, Object>>(data, HttpStatus.OK);        
	}

	@PostMapping("/delete")
    public ResponseEntity<Map<String, Object>> delete(@RequestParam Map<String, Object> param) {	
		Map<String,Object> data = service.delete(param);				
        return new ResponseEntity<Map<String, Object>>(data, HttpStatus.OK);        
	}

}
