package com.listener;

import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;
import java.util.Enumeration;
import java.util.Hashtable;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;


import com.handler.WebSocketHandler;


@Component
public class SessionListener implements HttpSessionListener {

	private static final Logger log = LogManager.getLogger(SessionListener.class);

    public static SessionListener sessionListener = null;
    private static Hashtable loginSessionList = new Hashtable();

    public static synchronized SessionListener getInstance() {
        if(sessionListener == null) {
            sessionListener = new SessionListener();
        }
        return sessionListener;
    }

    @Override
    public void sessionCreated(HttpSessionEvent httpSessionEvent) {
        log.info("sessionCreated -> {}", httpSessionEvent.getSession().getAttribute("user_id"));
//		log.info(ws);
//		WebSocketHandler.handleTextMessage();
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent httpSessionEvent) {
        HttpSession session = httpSessionEvent.getSession();
        String userId = (String) session.getAttribute("user_id");
        synchronized(loginSessionList){
            loginSessionList.remove(httpSessionEvent.getSession().getId());
//			log.info("session Destroyed");
//			WebSocketHandler ws = new WebSocketHandler();
//			ws.testMessage();
			WebSocketHandler.sessionDestroyed((String)session.getId());
        }
        if(userId != null){
            this.updateUserCloseTime(userId);
        }
        currentSessionList();
    }

    private void currentSessionList(){
        Enumeration elements = loginSessionList.elements();
        HttpSession session = null;
        while (elements.hasMoreElements()){
            session = (HttpSession)elements.nextElement();
            String userId = (String)session.getAttribute("user_id");
            log.info("currentSessionUserList -> userId {} ", userId);
        }
    }

    public void setSession(HttpSession session){
        synchronized(loginSessionList){
            loginSessionList.put(session.getId(), session);
        }
        currentSessionList();
    }

    public void removeSession(HttpSession session){
		loginSessionList.remove(session.getId());
        currentSessionList();
    }

    private void updateUserCloseTime(String userId) {
        log.info("updateUserCloseTime {} ", userId);
    }

    public boolean isLoginUser(HttpServletRequest request, String loginUserId){
        Enumeration elements = loginSessionList.elements();
        HttpSession session = null;
        while (elements.hasMoreElements()){
            session = (HttpSession)elements.nextElement();
            String userId = (String)session.getAttribute("user_id");
            if(loginUserId.equals(userId) && (!session.getId().equals(request.getSession().getId()))){
                return true;
            }
        }
        return false;
    }

}