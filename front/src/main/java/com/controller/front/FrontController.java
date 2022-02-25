package com.controller.front;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpSession;

import com.service.front.FrontService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class FrontController {

	private static final Logger log = LogManager.getLogger(FrontService.class);
	
	@Autowired
	private FrontService service;
	
	@PostMapping("/menu")
    public ResponseEntity<Map<String, Object>> getSystemMenu(@RequestParam Map<String, Object> param, HttpSession session) {
		Map<String,Object> data = service.getSystemMenu(param);
        return new ResponseEntity<Map<String, Object>>(data, HttpStatus.OK);        
	}

	@PostMapping("/login")
    public ResponseEntity<Map<String, Object>> userLogin(@RequestParam Map<String, Object> param, HttpSession session) {
		Map<String,Object> data = service.userLogin(param, session);
        return new ResponseEntity<Map<String, Object>>(data, HttpStatus.OK);
	}

	@PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> userLogout(@RequestParam Map<String, Object> param, HttpSession session) {
		Map<String,Object> data = service.userLogout(param, session);
        return new ResponseEntity<Map<String, Object>>(data, HttpStatus.OK);
	}

	@PostMapping("/kill")
    public ResponseEntity<Map<String, Object>> userSessionKill(@RequestParam Map<String, Object> param, HttpSession session) {
		Map<String,Object> data = service.userSessionKill(param, session);
        return new ResponseEntity<Map<String, Object>>(data, HttpStatus.OK);
	}

	@PostMapping("/checkLoginSession")
    public void checkLoginSession() {
	}

	

}
