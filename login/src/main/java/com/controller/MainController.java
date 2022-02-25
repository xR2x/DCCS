package com.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * INDEX
 * @패키지명 	: com.controller 
 * @파일명 	: MainController.java 
 * @작성자 	: Mr.Chu
 * @최초생성일 	: 2022.02.18 
 * @클래스내역	: 
 * =========================================================== 
 * DATE              AUTHOR              NOTE 
 * ----------------------------------------------------------- 
 * 2022.02.18 		Mr.Chu 				최초 생성 
 * ===========================================================
 */
@Controller
public class MainController {
    
	@Value("${title}")
	private String title;
	
	@RequestMapping(value="/")
	public String index(Model model) {
		model.addAttribute("title", title);
		return "index";		
	}
}
