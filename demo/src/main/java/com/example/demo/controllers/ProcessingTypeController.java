package com.example.demo.controllers;

import com.example.demo.dto.*;
import com.example.demo.models.ProcessingMethod;
import com.example.demo.models.ProcessingType;
import com.example.demo.models.ProcessingTypeAttributeBindings;
import com.example.demo.models.ProcessingTypeAttributes;
import com.example.demo.repositories.ProcessingMethodRepository;
import com.example.demo.repositories.ProcessingTypeAttributeBindingsRepository;
import com.example.demo.repositories.ProcessingTypeAttributesRepository;
import com.example.demo.repositories.ProcessingTypeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/processing-type")
public class ProcessingTypeController {
    private final ProcessingTypeRepository processingTypeRepository;
    private final ProcessingTypeAttributeBindingsRepository bindingsRepository;
    private final ProcessingMethodRepository methodRepository;
    private final ProcessingTypeAttributesRepository attributesRepository;

    public ProcessingTypeController(ProcessingTypeRepository processingTypeRepository,
                                    ProcessingTypeAttributeBindingsRepository bindingsRepository,
                                    ProcessingMethodRepository methodRepository, ProcessingTypeAttributesRepository attributesRepository) {
        this.processingTypeRepository = processingTypeRepository;
        this.bindingsRepository = bindingsRepository;
        this.methodRepository = methodRepository;
        this.attributesRepository = attributesRepository;
    }

    @GetMapping("/children")
    public ResponseEntity<?> getChildren(@RequestParam(required = false) Long parentId)
    {
        List<ProcessingType> children = processingTypeRepository.findByParentId(parentId);
        List<Long> allParentsIds = processingTypeRepository.findAllParentIds();

        List<ProcessingTypeNodeResponse> responses = children.stream().map(child -> {
            ProcessingTypeNodeResponse response = new ProcessingTypeNodeResponse();
            response.setId(child.getId());
            response.setUrl(child.getUrl());
            response.setLeaf(!allParentsIds.contains(child.getId())); // если он не родитель — значит leaf
            return response;
        }).toList();

        return ResponseEntity.ok(responses);
    }

    @PostMapping("/children/attributes") // получает все аттрибуты
    public ResponseEntity<?> getAttributesForTypeAndMethod(@RequestBody ProcessingTypeAttributesRequest request)
    {
       ProcessingMethod method = methodRepository.findByName(request.getMethodName())
                .orElseThrow(() -> new RuntimeException("Method not found"));

        List<ProcessingTypeAttributeBindings> bindings = bindingsRepository.findByProcessingMethodAndParentId(
                method.getId(), request.getNodeId());

        ProcessingTypeAttributesResponse responses = new ProcessingTypeAttributesResponse();
        List<ProcessingTypeAttributeResponse> list = bindings.stream().map(binding ->{
            ProcessingTypeAttributeResponse response = new ProcessingTypeAttributeResponse();
            response.setId(binding.getProcessingTypesAttributes().getId());
            response.setName(binding.getProcessingTypesAttributes().getName());
            response.setRequired(binding.isRequired());

            return response;
        }).toList();

        responses.setAttributes(list);

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("status",HttpStatus.OK.value(),
            "message", "Successfully", "data", responses));
    }

    @PostMapping("/attribute/create")
    public ResponseEntity<?> createAttribute(@RequestBody ProcessingTypeAttributeBindingsRequest request)
    {
        ProcessingMethod method = methodRepository.findByName(request.getMethodName())
                .orElseThrow(() -> new RuntimeException("Method not found"));

       ProcessingType type =  processingTypeRepository.findById(request.getTypeId())
               .orElseThrow(() -> new RuntimeException("Type not found"));


       Optional<ProcessingTypeAttributes> optAttribute  = attributesRepository.findByName(request.getAttributeName());

        ProcessingTypeAttributes attribute;
        if(optAttribute.isEmpty()) // создать новый аттрибут если нету
        {
            ProcessingTypeAttributes new_attribute = new ProcessingTypeAttributes();
            new_attribute.setUnit(request.getUnit());
            new_attribute.setName(request.getAttributeName());

            attribute = attributesRepository.save(new_attribute);
        }
        else
        {
            attribute = optAttribute.get();

            // 3б. Проверяем, существует ли такая привязка
            Optional<ProcessingTypeAttributeBindings> existingBinding =
                    bindingsRepository.findByProcessingMethodAndParentIdAndAttributeId(
                            method.getId(), type.getId(), attribute.getId());
            if (existingBinding.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("status", HttpStatus.CONFLICT.value(), "error", "Binding already exists"));
            }
        }

        ProcessingTypeAttributeBindings new_binding = new ProcessingTypeAttributeBindings();
        new_binding.setProcessingType(type);
        new_binding.setProcessingMethod(method);
        new_binding.setProcessingTypesAttributes(attribute);
        new_binding.setRequired(request.isRequired());

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("status",HttpStatus.CREATED.value(),
                "message", "Attribute binding created successfully"));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createProcessingType(@RequestBody ProcessingTypeRequest request)
    {
        Optional<ProcessingType> existing = processingTypeRepository.findByUrl(request.getUrl());
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("status", 409, "error", "URL already exists"));
        }


        ProcessingType newType = new ProcessingType();
        newType.setUrl(request.getUrl());

        if(request.getParentId() != null)
        {
            ProcessingType parent = processingTypeRepository.findById(request.getParentId()).orElseThrow(
                    () -> new RuntimeException("Parent not found"));

            newType.setParent(parent);
        }

        ProcessingType saved = processingTypeRepository.save(newType);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("status", HttpStatus.CREATED.value(), "message", "Created", "data", saved));
    }
}
