package com.example.demo.controllers;


import com.example.demo.dto.MaterialRequest;
import com.example.demo.dto.MaterialResponse;
import com.example.demo.models.Material;
import com.example.demo.models.User;
import com.example.demo.repositories.MaterialRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/material")
public class MaterialController {

    private final MaterialRepository materialRepo;

    public MaterialController(MaterialRepository materialRepo){
        this.materialRepo = materialRepo;
    }

    @PostMapping
    public ResponseEntity<?> createMaterial(@RequestBody MaterialRequest request)
    {
        Material material = new Material();
        material.setBrand(request.getBrand());
        material.setHardness(request.getHardness());
        material.setGroup_iso(request.getGroup_iso());

        Material saved = materialRepo.save(material);

        MaterialResponse materialResponse = new MaterialResponse(saved.getId(),
                saved.getBrand(), saved.getHardness(), saved.getGroup_iso());

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("status",HttpStatus.CREATED.value(),
                "message", "Successfully created", "data", materialResponse));
    }

    @GetMapping
    public ResponseEntity<?> getAllMaterials()
    {
        List<MaterialResponse> materialResponses = materialRepo.findAll().stream().map(m ->
                new MaterialResponse(m.getId(), m.getBrand(),m.getHardness(), m.getGroup_iso())).toList();

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("status",HttpStatus.OK.value(),
                "message", "Successfully loaded materials", "data", materialResponses));

    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMaterialById(@PathVariable Long id) {
        Material material = materialRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        MaterialResponse response = new MaterialResponse(
                material.getId(),
                material.getBrand(),
                material.getHardness(),
                material.getGroup_iso()
        );

        return ResponseEntity.ok(Map.of(
                "status", 200,
                "message", "Material found",
                "data", response
        ));
    }

}
