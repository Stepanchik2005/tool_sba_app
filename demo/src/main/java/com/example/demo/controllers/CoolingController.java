package com.example.demo.controllers;

import com.example.demo.repositories.CoolingMethodRepository;
import com.example.demo.repositories.CoolingTypeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/cooling")
public class CoolingController {
    private final CoolingTypeRepository coolingTypeRepository;
    private final CoolingMethodRepository coolingMethodRepository;

    public CoolingController(CoolingTypeRepository coolingTypeRepository,
                             CoolingMethodRepository coolingMethodRepository) {
        this.coolingTypeRepository = coolingTypeRepository;
        this.coolingMethodRepository = coolingMethodRepository;
    }

    @GetMapping("/types")
    public ResponseEntity<?> getCoolingTypes() {
        return ResponseEntity.ok(Map.of("data", coolingTypeRepository.findAll()));
    }

    @GetMapping("/methods")
    public ResponseEntity<?> getCoolingMethods() {
        return ResponseEntity.ok(Map.of("data", coolingMethodRepository.findAll()));
    }
}
