package com.example.demo.controllers;

import com.example.demo.dto.*;
import com.example.demo.models.Process.ProcessingMethod;
import com.example.demo.models.Process.ProcessingType;
import com.example.demo.models.Process.ProcessingTypeAttributeBindings;
import com.example.demo.models.Process.ProcessingTypeAttributes;
import com.example.demo.repositories.ProcessingMethodRepository;
import com.example.demo.repositories.ProcessingTypeAttributeBindingsRepository;
import com.example.demo.repositories.ProcessingTypeAttributesRepository;
import com.example.demo.repositories.ProcessingTypeRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/processing-type")
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

        return  ResponseEntity.status(HttpStatus.OK).body(Map.of("status",HttpStatus.OK.value(),
            "message", "Successfully", "data", responses));
    }

    @GetMapping("/attributes")
    public ResponseEntity<?> getAttributes()
    {
        List<ProcessingTypeAttributes> attributes = attributesRepository.findAll(Sort.by("name"));

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("status",HttpStatus.OK.value(),
                "message", "Successfully", "data", attributes));
    }
    @GetMapping
    public ResponseEntity<?> getAllMethods() {
        List<ProcessingMethod> methods = methodRepository.findAll();

        return ResponseEntity.ok(Map.of(
                "status", 200,
                "message", "Методи обробки завантажено",
                "data", methods
        ));
    }
    @PostMapping("/children/attributes") // получает все аттрибуты
    public ResponseEntity<?> getAttributesForTypeAndMethod(@RequestBody ProcessingTypeAttributesRequest request)
    {
        List<ProcessingTypeAttributeBindings> bindings;
//        if (request.getMethodName() != null && !request.getMethodName().isBlank()) {
//            method = methodRepository.findByName(request.getMethodName())
//                    .orElseThrow(() -> new RuntimeException("Method not found"));
//
//            bindings = bindingsRepository.findByParentIdAndMethodOrUniversal(
//                    request.getNodeId(),
//                    method.getId()
//            );
//        } else {
//            bindings = bindingsRepository.findByProcessingMethodIsNullAndParentId(request.getNodeId());
//        }

        ProcessingMethod method = methodRepository.findById(request.getMethodId())
                   .orElseThrow(() -> new RuntimeException("Method not found"));
        bindings = bindingsRepository.findByParentIdAndMethodOrUniversal(
                        request.getNodeId(),
                        method.getId()
               );

        ProcessingTypeAttributesResponse data = new ProcessingTypeAttributesResponse();
        List<ProcessingTypeAttributeResponse> list = bindings.stream().map(binding ->{
            ProcessingTypeAttributeResponse response = new ProcessingTypeAttributeResponse();
            response.setId(binding.getProcessingTypesAttributes().getId());
            response.setName(binding.getProcessingTypesAttributes().getName());
            response.setIsRequired(binding.getIsRequired());
            return response;
        }).toList();

        data.setAttributes(list);

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("status",HttpStatus.OK.value(),
            "message", "Successfully", "data", data));
    }

    @PostMapping("/attribute/create")
    public ResponseEntity<?> createAttribute(@RequestBody ProcessingTypeAttributeBindingsRequest request)
    {
        ProcessingMethod method = null;
        if (request.getMethodName() != null && !request.getMethodName().isBlank()) {
            method = methodRepository.findByName(request.getMethodName())
                    .orElseThrow(() -> new RuntimeException("Method not found"));
        }


        ProcessingType type =  processingTypeRepository.findById(request.getTypeId())
               .orElseThrow(() -> new RuntimeException("Type not found"));


       Optional<ProcessingTypeAttributes> optAttribute  = attributesRepository.findById(request.getAttributeId());

        ProcessingTypeAttributes attribute;
        if(optAttribute.isEmpty()) // создать новый аттрибут если нету
        {
            ProcessingTypeAttributes new_attribute = new ProcessingTypeAttributes();
            new_attribute.setUnit(request.getUnit());
            new_attribute.setName(request.getName());

            attribute = attributesRepository.save(new_attribute);
        }
        else
        {
            attribute = optAttribute.get();

            Optional<ProcessingTypeAttributeBindings> existingBinding =
                    (method != null)
                            ? bindingsRepository.findByProcessingMethodAndParentIdAndAttributeId(method.getId(),request.getTypeId(),attribute.getId())
                            : bindingsRepository.findByProcessingMethodIsNullAndParentIdAndAttributeId(request.getTypeId(),attribute.getId());
            if (existingBinding.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("status", HttpStatus.CONFLICT.value(), "error", "Binding already exists"));
            }
        }

        ProcessingTypeAttributeBindings new_binding = new ProcessingTypeAttributeBindings();
        new_binding.setProcessingType(type);
        new_binding.setProcessingMethod(method);
        new_binding.setProcessingTypesAttributes(attribute);
        new_binding.setIsRequired(request.getIsRequired());
        bindingsRepository.save(new_binding);


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
