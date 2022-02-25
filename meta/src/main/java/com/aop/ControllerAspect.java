package com.aop;

import java.util.Map;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
@ControllerAdvice(annotations = RestController.class)
public class ControllerAspect {
		
	private static final Logger log = LogManager.getLogger(ControllerAspect.class);	
	
	@Before("execution(* *..*Controller.*(..))")
	public void before(final JoinPoint joinPoint) {		
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
		HttpSession session = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest().getSession();
		
        Object[] args = joinPoint.getArgs();
		try{
			if(session.getAttribute("company") != null) {
				if(args != null) {
					if(args.length > 0) { 
						if(args[0].getClass().getName().trim().equals("java.util.LinkedHashMap")) {
							Map param = (Map)args[0];        
							param.put("company", session.getAttribute("company"));
							param.put("user_id", session.getAttribute("user_id"));

							//멀티검색
							if(param.get("multiSearch") != null){
								ObjectMapper objectMapper = new ObjectMapper();
								HashMap<String, Object> multiSearch = objectMapper.readValue(param.get("multiSearch")+"", HashMap.class);
								Iterator<String> multiKeys = multiSearch.keySet().iterator();
								while (multiKeys.hasNext()){ 
									String multiKey = multiKeys.next(); 
									List<?> multiList = (List<?>)multiSearch.get(multiKey);
									param.put(multiKey+"_multi",multiList);
								}
								param.remove("multiSearch");
							}
						}
					}
				}
			}
		}catch(Exception e){
		}
	}
}
