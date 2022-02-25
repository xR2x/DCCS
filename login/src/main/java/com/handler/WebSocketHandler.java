package com.handler;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

	private static final Logger log = LogManager.getLogger(WebSocketHandler.class);

    private static List<WebSocketSession> socketSessions = new ArrayList<>();
 
    public WebSocketHandler(){
	}

    @Override
    public void afterConnectionEstablished(WebSocketSession socketSession) {
		try{
			socketSessions.add(socketSession);
//			log.info("connect : {}", socketSession);
//			log.info("session : {}", socketSession.getAttributes());
			Map<String, Object> sessionMap = socketSession.getAttributes();
//			handleTextMessage(new TextMessage((String)sessionMap.get("user_id")));
		}catch(Exception e){
			log.info(e);
		}
    }

    public static void testMessage() {
		try{
//			log.info(mySession);
			handleTextMessage(new TextMessage("{\"type\":\"action\",\"handler\":\"sessionDestroyed\"}"));
			log.info("test:1111111111111111111111");
		}catch(Exception e){
		}
    }

	public static void sessionDestroyed(String sessionId){
		try{
			log.info(sessionId);
			for(WebSocketSession sess : socketSessions){
				Map<String, Object> sessionMap = sess.getAttributes();
				log.info((String)sessionMap.get("HTTP.SESSION.ID"));
				if(sessionId.equals((String)sessionMap.get("HTTP.SESSION.ID"))){

					log.info((String)sessionMap.get("user_id"));
					sess.sendMessage(new TextMessage("{\"type\":\"action\",\"handler\":\"sessionDestroyed\"}"));
				}
//				TextMessage msg = new TextMessage(message.getPayload());
//				sess.sendMessage(msg);
			}
//			handleTextMessage(new TextMessage("{\"type\":\"action\",\"handler\":\"sessionDestroyed\"}"));
		}catch(Exception e){
		}
	}


    protected static void handleTextMessage(TextMessage message) {
		try{
			for(WebSocketSession sess : socketSessions){
				TextMessage msg = new TextMessage(message.getPayload());
				sess.sendMessage(msg);
			}
		}catch(Exception e){
		}
    }
 
    @Override
    public void afterConnectionClosed(WebSocketSession socketSession, CloseStatus status) {
		try{
			socketSessions.remove(socketSession);
			log.info("out : {}",  socketSession);
		}catch(Exception e){
		}
    }
}