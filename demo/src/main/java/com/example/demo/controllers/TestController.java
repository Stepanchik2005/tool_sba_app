package com.example.demo.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/secure")
    public ResponseEntity<Map> secureEndpoint() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(Map.of("status", HttpStatus.OK.value(),
                        "message", "Доступ к защищённому ресурсу разрешён"));
    }
}

