package com.example.demo.controllers.Set;

import com.example.demo.dto.set.SupplierRequest;
import com.example.demo.dto.set.SupplierResponse;
import com.example.demo.models.Set.Supplier;
import com.example.demo.models.User;
import com.example.demo.repositories.*;
import com.example.demo.repositories.Details.DetailRepository;
import com.example.demo.repositories.Set.SupplierRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/supplier")
public class SupplierController {
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

    public SupplierController(ProcessingTypeRepository processingTypeRepository,
                                                   ProcessingTypeAttributeBindingsRepository bindingsRepository,
                                                   ProcessingMethodRepository methodRepository, ProcessingTypeAttributesRepository attributesRepository,
                                                   ProcessingTypeAttributeValuesRepository valuesRepository, UserRepository userRepo,
                                                   DetailRepository detailRepo, CoolingTypeRepository coolingTypeRepository,
                                                   CoolingMethodRepository coolingMethodRepository, SupplierRepository supplierRepository) {
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
    }

    @PostMapping("/create")
    public ResponseEntity<?> createSupplier(@RequestBody SupplierRequest request, Authentication auth)
    {
        User user = userRepo.findByUsername(auth.getName()).orElseThrow(() -> new RuntimeException("User not found"));

       Optional<Supplier> existing = supplierRepository.findByName(request.name());

       if(existing.isPresent())
       {
           return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                   "status", HttpStatus.CONFLICT.value(),
                   "error", "Supplier with this name is already exists"
           ));
       }

       if(request.name() == null || request.email() == null)
       {
           return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                   "status", HttpStatus.CONFLICT.value(),
                   "error", "The required field is NULL"
           ));
       }


        Supplier newSupplier = new Supplier();
        newSupplier.setEmail(request.email());
        newSupplier.setName(request.name());
        newSupplier.setUser(user);
        if(request.mobile() != null)
            newSupplier.setMobile(request.mobile());


        Supplier saved =  supplierRepository.save(newSupplier);

        return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                "status", HttpStatus.OK.value(),
                "message", "Successfully added",
                "data", saved
        ));
    }

    @GetMapping("/get-all")
    public ResponseEntity<?> getAllSuppliers()
    {
        List<Supplier> suppliers = supplierRepository.findAll();

        if(suppliers.isEmpty())
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "status", HttpStatus.NOT_FOUND.value(),
                    "error", "Suppliers not found"
            ));
        }

        List<SupplierResponse> responses = suppliers.stream().map(
                res -> {
                    SupplierResponse response = new SupplierResponse(
                            res.getId(), res.getEmail(), res.getName(), res.getMobile()
                    );
                    return response;
                }
        ).toList();

        return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                "status", HttpStatus.OK.value(),
                "message", "Successfully got suppliers",
                "data", responses
        ));
    }
}
