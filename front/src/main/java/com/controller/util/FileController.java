package com.controller.util;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpSession;

import com.service.util.FileService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/file")
public class FileController {

	private static final Logger log = LogManager.getLogger(FileController.class);
	
	@Autowired
	private FileService service;

	@PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> fileUpload(@RequestParam Map<String, Object> param, MultipartHttpServletRequest files) {

		Map<String,Object> data = service.fileUpload(param,files);
				
        return new ResponseEntity<Map<String, Object>>(data, HttpStatus.OK);
        
	}


}
