package com.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

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
