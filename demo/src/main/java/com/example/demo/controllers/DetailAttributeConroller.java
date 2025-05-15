package com.example.demo.controllers;

import com.example.demo.dto.details.DetailAttributeRequest;
import com.example.demo.models.Details.DetailAttributes;
import com.example.demo.models.Details.ShapeAttributeMapping;
import com.example.demo.repositories.Details.DetailAttributeRepository;
import com.example.demo.repositories.Details.ShapeAttributeMappingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/detail_attributes")
public class DetailAttributeConroller {
    private final DetailAttributeRepository attributeRepo;
    private final ShapeAttributeMappingRepository shapeAttributeMappingRepo;

    public DetailAttributeConroller(DetailAttributeRepository attributeRepo, ShapeAttributeMappingRepository shapeAttributeMappingRepo)
    {
        this.shapeAttributeMappingRepo = shapeAttributeMappingRepo;
        this.attributeRepo = attributeRepo;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createAttribute(@RequestBody DetailAttributeRequest request)
    {
        // 🔍 Проверка: существует ли атрибут с таким именем
        Optional<DetailAttributes> existing = attributeRepo.findByName(request.getName());
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "status", 409,
                    "error", "Атрибут с названием \"" + request.getName() + "\" уже существует"
            ));
        }

        DetailAttributes attributes = new DetailAttributes();
        attributes.setName(request.getName());
        attributes.setUnit(request.getUnit());

        DetailAttributes saved = attributeRepo.save(attributes);

        ShapeAttributeMapping mapping = new ShapeAttributeMapping();

        mapping.setShape(request.getShape());
        mapping.setAttribute(saved);

        shapeAttributeMappingRepo.save(mapping);


        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "status", 201,
                "message", "Attribute created",
                "data", saved
        ));
    }

    @GetMapping
    public ResponseEntity<?> getAttributesByShape(@RequestParam String shape)
    {
        List<ShapeAttributeMapping> mappings = shapeAttributeMappingRepo.findByShape(shape);

        if (mappings.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT)
                    .body(Map.of(
                            "status", HttpStatus.NO_CONTENT.value(),
                            "error", "Немає атрибутів для форми: " + shape
                    ));
        }

        List<DetailAttributes> attributes = mappings.stream().map(ShapeAttributeMapping::getAttribute).toList();

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "status", HttpStatus.CREATED.value(),
                "message", "Successfully",
                "data", attributes));
    }


}
