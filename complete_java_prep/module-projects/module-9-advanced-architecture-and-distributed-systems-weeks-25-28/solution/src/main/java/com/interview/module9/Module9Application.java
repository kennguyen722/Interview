package com.interview.module9;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.retry.annotation.EnableRetry;

@SpringBootApplication
@EnableRetry
public class Module9Application {

    public static void main(String[] args) {
        SpringApplication.run(Module9Application.class, args);
    }
}
