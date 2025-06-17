package com.example.demo.controllers;

import com.example.demo.dto.ProcessingTypeAttributeValuesRequest;
import com.example.demo.models.*;
import com.example.demo.models.Details.Detail;
import com.example.demo.models.Process.ProcessingType;
import com.example.demo.models.Process.ProcessingTypeAttributeValues;
import com.example.demo.models.Process.ProcessingTypeAttributes;
import com.example.demo.repositories.*;
import com.example.demo.repositories.Details.DetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/processing-type/attribute-values")
@RequiredArgsConstructor
public class ProcessingTypeAttributeValuesController {

    private final ProcessingTypeRepository processingTypeRepository;
    private final ProcessingTypeAttributeBindingsRepository bindingsRepository;
    private final ProcessingMethodRepository methodRepository;
    private final ProcessingTypeAttributesRepository attributesRepository;
    private final ProcessingTypeAttributeValuesRepository valuesRepository;
    private final UserRepository userRepo;
    private final DetailRepository detailRepo;
    private final CoolingTypeRepository coolingTypeRepository;
    private final CoolingMethodRepository coolingMethodRepository;
    private final TechnologicalSituationRepository situationRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createProcessingTypeAttributeValues(
            @RequestBody ProcessingTypeAttributeValuesRequest request,
            Authentication auth) {

        String username = auth.getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProcessingType type = processingTypeRepository.findById(request.getProcessingTypeId())
                .orElseThrow(() -> new RuntimeException("Type not found"));

        Detail detail = detailRepo.findById(request.getDetailId())
                .orElseThrow(() -> new RuntimeException("Detail not found"));

        TechnologicalSituation situation = situationRepository.findById(request.getTechnologicalSituationId())
                .orElseThrow(() -> new RuntimeException("Technological situation not found"));

        CoolingType coolingType = null;
        CoolingMethod coolingMethod = null;

        if (request.getCoolingTypeId() != null) {
            coolingType = coolingTypeRepository.findById(request.getCoolingTypeId())
                    .orElseThrow(() -> new RuntimeException("CoolingType not found"));
        }

        if (request.getCoolingMethodId() != null) {
            coolingMethod = coolingMethodRepository.findById(request.getCoolingMethodId())
                    .orElseThrow(() -> new RuntimeException("CoolingMethod not found"));
        }

        List<ProcessingTypeAttributeValues> toSave = new ArrayList<>();
        List<String> duplicates = new ArrayList<>();

        for (ProcessingTypeAttributeValuesRequest.AttributeValueItem item : request.getValues()) {

            ProcessingTypeAttributes attribute = attributesRepository.findById(item.getAttributeId())
                    .orElseThrow(() -> new RuntimeException("Attribute not found: " + item.getAttributeId()));

            boolean exists = valuesRepository.exists(
                    request.getProcessingTypeId(),
                    item.getAttributeId(),
                    request.getDetailId(),
                    user.getId(),
                    item.getValue()
            );

            if (exists) {
                duplicates.add("Duplicate for attributeId " + item.getAttributeId());
                continue;
            }

            ProcessingTypeAttributeValues newValue = new ProcessingTypeAttributeValues();
            newValue.setProcessingType(type);
            newValue.setDetail(detail);
            newValue.setProcessingTypeAttributes(attribute);
            newValue.setUser(user);
            newValue.setValue(item.getValue());
            newValue.setTechnologicalSituation(situation);

            // ⬇️ Привязка охолодження
            newValue.setCoolingType(coolingType);
            newValue.setCoolingMethod(coolingMethod);

            toSave.add(newValue);
        }

        valuesRepository.saveAll(toSave);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "status", HttpStatus.CREATED.value(),
                        "saved", toSave.size(),
                        "duplicates", duplicates
                ));

    }


}
