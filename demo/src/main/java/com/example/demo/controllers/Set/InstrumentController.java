package com.example.demo.controllers.Set;
import com.example.demo.dto.set.InstrumentRequest;
import com.example.demo.dto.set.InstrumentResponse;
import com.example.demo.models.InstrumentMaterial;
import com.example.demo.models.Material;
import com.example.demo.models.Set.*;
import com.example.demo.models.User;
import com.example.demo.repositories.MaterialRepository;
import com.example.demo.repositories.Set.*;
import com.example.demo.repositories.UserRepository;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
@RestController
@RequestMapping("/api/instrument")
public class InstrumentController {

    private final InstrumentRepository instrumentRepository;
    private final SupplierRepository supplierRepository;
    private final BrandRepository brandRepository;
    private final UserRepository userRepository;
    private final MaterialRepository materialRepository;
    private final InstrumentMaterialRepository instrumentMaterialRepository;
    public InstrumentController(InstrumentRepository instrumentRepository,
                                SupplierRepository supplierRepository,
                                BrandRepository brandRepository,
                                UserRepository userRepository, MaterialRepository materialRepository,
                                InstrumentMaterialRepository instrumentMaterialRepository) {
        this.instrumentRepository = instrumentRepository;
        this.supplierRepository = supplierRepository;
        this.brandRepository = brandRepository;
        this.userRepository = userRepository;
        this.materialRepository = materialRepository;
        this.instrumentMaterialRepository = instrumentMaterialRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createInstrument(@RequestBody InstrumentRequest request, Authentication auth) {
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Supplier supplier = supplierRepository.findById(request.supplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        Optional<Instrument> existing = instrumentRepository
                .findByUserIdAndSupplierIdAndArticleNumber(user.getId(), supplier.getId(), request.articleNumber());

        Material material = materialRepository.findById(request.materialId()).orElseThrow(() -> new RuntimeException("Material not found"));


        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "status", HttpStatus.CONFLICT.value(),
                    "error", "This instrument already exists"
            ));
        }

        if (request.name() == null || request.articleNumber() == null || request.link() == null || request.marking() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "status", HttpStatus.BAD_REQUEST.value(),
                    "error", "One or more required fields are null"
            ));
        }

        Instrument instrument = new Instrument();
        instrument.setName(request.name());
        instrument.setMarking(request.marking());
        instrument.setArticleNumber(request.articleNumber());
        instrument.setLink(request.link());
        instrument.setUser(user);
        instrument.setSupplier(supplier);
        instrument.setInstrumentMaterial(request.instrumentMaterial());

        InstrumentMaterial instrumentMaterial = new InstrumentMaterial();
        instrumentMaterial.setInstrument(instrument);
        instrumentMaterial.setMaterial(material);

        if (request.brandId() != null) {
            Brand brand = brandRepository.findById(request.brandId())
                    .orElseThrow(() -> new RuntimeException("Brand not found"));
            instrument.setBrand(brand);
        }

        Instrument saved = instrumentRepository.save(instrument);

        instrumentMaterialRepository.save(instrumentMaterial);

        String brandName = saved.getBrand() != null ? saved.getBrand().getName() : null;

        InstrumentResponse response = new InstrumentResponse(
                saved.getId(),
                saved.getName(),
                saved.getMarking(),
                saved.getArticleNumber(),
                saved.getLink(),
                saved.getInstrumentMaterial(),
                saved.getSupplier().getName(),
                brandName,
                material.getBrand()
        );

        return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                "status", HttpStatus.OK.value(),
                "message", "Instrument successfully created",
                "data", response
        ));

    }
}
