package com.example.demo.controllers;


import com.example.demo.dto.material.MaterialRequest;
import com.example.demo.dto.material.MaterialResponse;
import com.example.demo.models.Material;
import com.example.demo.repositories.MaterialRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/material")
public class MaterialController {

    private final MaterialRepository materialRepo;

    public MaterialController(MaterialRepository materialRepo){
        this.materialRepo = materialRepo;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createMaterial(@RequestBody MaterialRequest request)
    {
        // 🔍 Проверка: существует ли атрибут с таким именем
        Optional<Material> existing = materialRepo.findByBrand(request.getBrand());
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "status", 409,
                    "error", "Материал с названием \"" + request.getBrand() + "\" уже существует"
            ));
        }

        Material material = new Material();
        material.setBrand(request.getBrand());
        material.setHardness(request.getHardness());
        material.setGroupIso(request.getGroupIso());
        material.setHardnessSpan(request.getHardnessSpan());

        Material saved = materialRepo.save(material);

        MaterialResponse materialResponse = new MaterialResponse(saved.getId(),
                saved.getBrand(), saved.getHardness(), saved.getGroupIso(), saved.getHardnessSpan());

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("status",HttpStatus.CREATED.value(),
                "message", "Successfully created", "data", materialResponse));
    }

    @GetMapping("/brands")
    public ResponseEntity<?> getAllBrands() {
        List<String> brands = materialRepo.findAll().stream()
                .map(Material::getBrand)
                .distinct()
                .toList();

        return ResponseEntity.ok(Map.of(
                "status", 200,
                "message", "List of material brands",
                "data", brands
        ));
    }

    @GetMapping("/by-brand")
    public ResponseEntity<?> getMaterialByBrand(@RequestParam String name) {
        Material material = materialRepo.findByBrand(name)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        MaterialResponse response = new MaterialResponse(
                material.getId(),
                material.getBrand(),
                material.getHardness(),
                material.getGroupIso(),
                material.getHardnessSpan()
        );

        return ResponseEntity.ok(Map.of(
                "status", 200,
                "message", "Material found",
                "data", response
        ));
    }

}
