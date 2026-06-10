package com.interview.module5;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class Module5Application {

    public static void main(String[] args) {
        SpringApplication.run(Module5Application.class, args);
    }
}
