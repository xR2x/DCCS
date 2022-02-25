package com.service.login;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Iterator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import javax.servlet.http.HttpSession;

import com.handler.WebSocketHandler;
import com.listener.SessionListener;
import com.mapper.login.LoginMapper;

@Service
public class LoginService {

	private static final Logger log = LogManager.getLogger(LoginService.class);


	@Autowired
	private LoginMapper mapper;
		
    public Map<String,Object> getSystemMenu(Map<String, Object> param){

        Map<String,Object> data=new HashMap<>();        
		try{
			List<Map<String, String>> result = mapper.systemMenu(param);    	    	
			data.put("data", result);
		}catch(Exception e){
			data.put("error", e.toString());
			log.error(e.toString());
		}
        return data;        
    }

	public Map<String,Object> userLogin(Map<String, Object> param, HttpSession session){

    	Map<String,Object> data = new HashMap<String,Object>();    	
    	try{
			List<Map<String, String>> result = mapper.userLogin(param);
			if(result.size() > 0){
				this.createSession(result,session);
				SessionListener sl = new SessionListener();
				sl.setSession(session);
				data.put("data", result);
			}else{
				data.put("error","no-such-user");
			}
		}catch(Exception e){
			data.put("error", e.toString());
			log.error(e.toString());
		}
        return data;        
    }

	public Map<String,Object> userLogout(Map<String, Object> param, HttpSession session){

    	Map<String,Object> data = new HashMap<String,Object>();    	
    	try{
			SessionListener sl = new SessionListener();
			sl.removeSession(session);
			session.invalidate();
		}catch(Exception e){
			data.put("error", e.toString());
			log.error(e.toString());
		}
        return data;        
    }

	public Map<String,Object> userSessionKill(Map<String, Object> param, HttpSession session){
    	Map<String,Object> data = new HashMap<String,Object>();    	
    	try{
//			WebSocketHandler ws = new WebSocketHandler();
//			WebSocketHandler.testMessage();
		}catch(Exception e){
			data.put("error", e.toString());
			log.error(e.toString());
		}
        return data;        
    }


	public HttpSession createSession(List list, HttpSession session){
		try{
			for(int i=0;i<list.size();i++){
				Map map = (Map)list.get(i);
				Iterator itr = map.keySet().iterator();
				while(itr.hasNext()){
					String key = (String)itr.next();
					String value = ((map.get(key)+"").replace("null","")).trim();
					session.setAttribute(key,value);
				}
			}
			session.setMaxInactiveInterval(864000);
		}catch(Exception e){
		}
		return session;
	}
}
