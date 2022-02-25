package com;

import org.springframework.boot.SpringApplication;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;

@EnableAspectJAutoProxy
@EnableRedisHttpSession
@SpringBootApplication
public class RpaApplication {

	public static void main(String[] args) {
		SpringApplication.run(RpaApplication.class, args);
	}
	
}
