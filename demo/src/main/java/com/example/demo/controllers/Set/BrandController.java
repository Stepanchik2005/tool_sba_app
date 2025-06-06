package com.example.demo.controllers.Set;

import com.example.demo.dto.set.BrandRequest;
import com.example.demo.dto.set.BrandResponse;
import com.example.demo.dto.set.SupplierResponse;
import com.example.demo.models.Set.Brand;
import com.example.demo.models.Set.Supplier;
import com.example.demo.repositories.Set.BrandRepository;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
@RestController
@RequestMapping("/api/brand")
public class BrandController {

    private final BrandRepository brandRepository;

    public BrandController(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createBrand(@RequestBody BrandRequest request) {
        if (request.name() == null || request.name().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "status", HttpStatus.BAD_REQUEST.value(),
                    "error", "Brand name cannot be empty"
            ));
        }

        Optional<Brand> existing = brandRepository.findByName(request.name().trim());
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "status", HttpStatus.CONFLICT.value(),
                    "error", "Brand already exists"
            ));
        }

        Brand newBrand = Brand.builder()
                .name(request.name().trim())
                .build();

        Brand saved = brandRepository.save(newBrand);

        return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                "status", HttpStatus.OK.value(),
                "message", "Brand created successfully",
                "data", saved
        ));
    }

    @GetMapping("/get-all")
    public ResponseEntity<?> getAllBrands()
    {
        List<Brand> brands = brandRepository.findAll();

        if(brands.isEmpty())
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "status", HttpStatus.NOT_FOUND.value(),
                    "error", "brands not found"
            ));
        }

        List<BrandResponse> responses = brands.stream().map(
                res -> {
                    BrandResponse response = new BrandResponse(
                            res.getId(),res.getName()
                    );
                    return response;
                }
        ).toList();

        return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                "status", HttpStatus.OK.value(),
                "message", "Successfully got brands",
                "data", responses
        ));
    }
}
