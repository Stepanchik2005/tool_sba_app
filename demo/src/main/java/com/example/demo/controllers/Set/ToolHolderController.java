package com.example.demo.controllers.Set;

import com.example.demo.dto.set.SupplierRequest;
import com.example.demo.dto.set.ToolHolderRequest;
import com.example.demo.dto.set.ToolHolderResponse;
import com.example.demo.models.Set.Brand;
import com.example.demo.models.Set.Supplier;
import com.example.demo.models.Set.ToolHolder;
import com.example.demo.models.User;
import com.example.demo.repositories.*;
import com.example.demo.repositories.Details.DetailRepository;
import com.example.demo.repositories.Set.BrandRepository;
import com.example.demo.repositories.Set.SupplierRepository;
import com.example.demo.repositories.Set.ToolHolderRepository;
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
@RequestMapping("/api/tool-holder")
public class ToolHolderController {
    private final ProcessingTypeRepository processingTypeRepository;
    private final ProcessingTypeAttributeBindingsRepository bindingsRepository;
    private final ProcessingMethodRepository methodRepository;
    private final ProcessingTypeAttributesRepository attributesRepository;
    private final ProcessingTypeAttributeValuesRepository valuesRepository;
    private final UserRepository userRepo;
    private final DetailRepository detailRepo;
    private final CoolingTypeRepository coolingTypeRepository;
    private final CoolingMethodRepository coolingMethodRepository;
    private final SupplierRepository supplierRepository;
    private final ToolHolderRepository holderRepository;
    private final BrandRepository brandRepository;

    public ToolHolderController(ProcessingTypeRepository processingTypeRepository,
                              ProcessingTypeAttributeBindingsRepository bindingsRepository,
                              ProcessingMethodRepository methodRepository, ProcessingTypeAttributesRepository attributesRepository,
                              ProcessingTypeAttributeValuesRepository valuesRepository, UserRepository userRepo,
                              DetailRepository detailRepo, CoolingTypeRepository coolingTypeRepository,
                              CoolingMethodRepository coolingMethodRepository, SupplierRepository supplierRepository,
                                ToolHolderRepository holderRepository, BrandRepository brandRepository) {
        this.processingTypeRepository = processingTypeRepository;
        this.bindingsRepository = bindingsRepository;
        this.methodRepository = methodRepository;
        this.attributesRepository = attributesRepository;
        this.valuesRepository = valuesRepository;
        this.userRepo = userRepo;
        this.detailRepo = detailRepo;
        this.coolingTypeRepository = coolingTypeRepository;
        this.coolingMethodRepository = coolingMethodRepository;
        this.supplierRepository = supplierRepository;
        this.holderRepository = holderRepository;
        this.brandRepository = brandRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createToolHolder(@RequestBody ToolHolderRequest request, Authentication auth)
    {
        User user = userRepo.findByUsername(auth.getName()).orElseThrow(() -> new RuntimeException("User not found"));

         Optional<ToolHolder> existing = holderRepository.findByUserIdAndSupplierIdAndArticleNumber(user.getId(), request.supplierId(), request.articleNumber());

         if(existing.isPresent())
         {
             return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                     "status", HttpStatus.CONFLICT.value(),
                     "error", "This holder is already exists"
             ));
         }
        if(request.name() == null || request.articleNumber() == null || request.link() == null
                || request.marking() == null)
        {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "status", HttpStatus.CONFLICT.value(),
                    "error", "The required field is NULL"
            ));
        }

        Supplier supplier = supplierRepository.findById(request.supplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));



        ToolHolder newHolder = new ToolHolder();
        newHolder.setName(request.name());
        newHolder.setLink(request.link());
        newHolder.setUser(user);
        newHolder.setMarking(request.marking());
        newHolder.setArticleNumber(request.articleNumber());
        newHolder.setSupplier(supplier);
        if(request.brandId() != null)
        {
            Brand brand = brandRepository.findById(request.brandId())
                    .orElseThrow(() -> new RuntimeException("Brand not found"));

            newHolder.setBrand(brand);
        }

        ToolHolder saved = holderRepository.save(newHolder);

        ToolHolderResponse response = new ToolHolderResponse(
                saved.getId(),
                saved.getName(),
                saved.getMarking(), 
                saved.getArticleNumber(),
                saved.getLink(),
                saved.getSupplier().getName(),
                saved.getBrand() != null ? saved.getBrand().getName() : null
        );

        return ResponseEntity.ok(Map.of(
                "status", HttpStatus.OK.value(),
                "message", "Successfully added",
                "data", response
        ));
    }
}
