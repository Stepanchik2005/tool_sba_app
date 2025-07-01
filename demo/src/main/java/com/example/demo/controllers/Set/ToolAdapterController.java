package com.example.demo.controllers.Set;

import com.example.demo.dto.set.SupplierResponse;
import com.example.demo.dto.set.ToolAdapterRequest;
import com.example.demo.dto.set.ToolAdapterResponse;
import com.example.demo.models.Set.Brand;
import com.example.demo.models.Set.Supplier;
import com.example.demo.models.Set.ToolAdapter;
import com.example.demo.models.User;
import com.example.demo.repositories.Set.BrandRepository;
import com.example.demo.repositories.Set.SupplierRepository;
import com.example.demo.repositories.ToolAdapterRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tool-adapter")
public class ToolAdapterController {

    private final ToolAdapterRepository adapterRepository;
    private final UserRepository userRepository;
    private final SupplierRepository supplierRepository;
    private final BrandRepository brandRepository;

    public ToolAdapterController(ToolAdapterRepository adapterRepository,
                                 UserRepository userRepository,
                                 SupplierRepository supplierRepository,
                                 BrandRepository brandRepository) {
        this.adapterRepository = adapterRepository;
        this.userRepository = userRepository;
        this.supplierRepository = supplierRepository;
        this.brandRepository = brandRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createToolAdapter(@RequestBody ToolAdapterRequest request, Authentication auth) {
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Supplier supplier = supplierRepository.findById(request.supplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

//        Optional<ToolAdapter> existing = adapterRepository
//                .findByUserIdAndSupplierIdAndArticleNumber(user.getId(), supplier.getId(), request.articleNumber());
//
//        if (existing.isPresent()) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
//                    "status", HttpStatus.CONFLICT.value(),
//                    "error", "This adapter already exists"
//            ));
//        }

        if (request.name() == null || request.articleNumber() == null || request.link() == null || request.marking() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "status", HttpStatus.BAD_REQUEST.value(),
                    "error", "One or more required fields are null"
            ));
        }

        ToolAdapter adapter = new ToolAdapter();
        adapter.setName(request.name());
        adapter.setArticleNumber(request.articleNumber());
        adapter.setMarking(request.marking());
        adapter.setLink(request.link());
        adapter.setUser(user);
        adapter.setSupplier(supplier);

        if (request.brandId() != null) {
            Brand brand = brandRepository.findById(request.brandId())
                    .orElseThrow(() -> new RuntimeException("Brand not found"));
            adapter.setBrand(brand);
        }

        ToolAdapter saved = adapterRepository.save(adapter);

        SupplierResponse supplierResponse = new SupplierResponse(supplier.getId(), supplier.getEmail(),
                supplier.getName(), supplier.getMobile(), supplier.getEdpou(), supplier.getAddress());

        ToolAdapterResponse response = new ToolAdapterResponse();
        response.setId(saved.getId());
        response.setName(saved.getName());
        response.setLink(saved.getLink());
        response.setName(saved.getName());
        response.setMarking(saved.getMarking());
        response.setBrandName(saved.getBrand().getName());
        response.setArticleNumber(saved.getArticleNumber());
        response.setSupplier(supplierResponse);

        return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                "status", HttpStatus.OK.value(),
                "message", "Tool adapter created successfully",
                "data", response
        ));
    }
}

