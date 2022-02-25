package com;

import org.springframework.boot.SpringApplication;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;

@EnableAspectJAutoProxy
@EnableRedisHttpSession
@SpringBootApplication
public class ItsmApplication {

	public static void main(String[] args) {
		SpringApplication.run(ItsmApplication.class, args);
	}
	
}
