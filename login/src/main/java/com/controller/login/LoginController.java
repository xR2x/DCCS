package com.controller.login;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.service.login.LoginService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpSession;

import lombok.RequiredArgsConstructor;

/**
 * @패키지명 	: com.controller.login 
 * @파일명 	: LoginController.java 
 * @작성자 	: Mr.Chu
 * @최초생성일 	: 2022.02.21 
 * @클래스내역	: 
 * =========================================================== 
 * DATE              AUTHOR              NOTE 
 * ----------------------------------------------------------- 
 * 2022.02.21 		Mr.Chu 				최초 생성 
 * ===========================================================
 */
@RequiredArgsConstructor
@RestController
public class LoginController {

	private static final Logger log = LogManager.getLogger(LoginService.class);
	
	@Autowired
	private LoginService service;
	
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
