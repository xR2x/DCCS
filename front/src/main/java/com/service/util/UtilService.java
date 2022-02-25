package com.service.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Iterator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.mapper.util.UtilMapper;

@Service
public class UtilService {

	private static final Logger log = LogManager.getLogger(UtilService.class);

	@Autowired
	private UtilService mapper;		

}
