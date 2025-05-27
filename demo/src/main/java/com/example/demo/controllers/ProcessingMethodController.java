package com.example.demo.controllers;

import com.example.demo.models.Process.ProcessingMethod;
import com.example.demo.repositories.ProcessingMethodRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/processing-methods")
public class ProcessingMethodController {

    private final ProcessingMethodRepository methodRepository;

    public ProcessingMethodController(ProcessingMethodRepository methodRepository) {
        this.methodRepository = methodRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllMethods() {
        List<ProcessingMethod> methods = methodRepository.findAll();

        return ResponseEntity.ok(Map.of(
                "status", 200,
                "message", "Методи обробки завантажено",
                "data", methods
        ));
    }
}

