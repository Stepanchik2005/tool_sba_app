package com.example.demo.controllers;

import com.example.demo.dto.DetailAttributeRequest;
import com.example.demo.models.DetailAttributes;
import com.example.demo.repositories.DetailAttributeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/attributes")
public class DetailAttributeConroller {
    private final DetailAttributeRepository attributeRepo;

    public DetailAttributeConroller(DetailAttributeRepository attributeRepo)
    {
        this.attributeRepo = attributeRepo;
    }

    @PostMapping
    public ResponseEntity<?> createAttribute(@RequestBody DetailAttributeRequest request)
    {
        DetailAttributes attributes = new DetailAttributes();

        attributes.setName(request.getName());
        attributes.setUnit(request.getUnit());
        attributes.setShape(request.getShape());

        attributeRepo.save(attributes);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "status", 201,
                "message", "Attribute created"
        ));
    }

    @GetMapping
    public ResponseEntity<?> getAttributeByShape(@RequestParam String shape)
    {
        List<DetailAttributes> attributes = attributeRepo.findByShape(shape);
        return ResponseEntity.ok(Map.of(
                "status", 200,
                "data", attributes
        ));
    }

}
