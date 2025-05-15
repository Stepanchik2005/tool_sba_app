package com.example.demo.controllers;

import com.example.demo.dto.details.*;
import com.example.demo.models.Details.*;
import com.example.demo.models.User;
import com.example.demo.repositories.Details.*;
import com.example.demo.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/details")
public class DetailController {

    private final DetailRepository detailRepo;
    private final UserRepository userRepo;
    private final DetailAttributeValuesRepository attributeValueRepo;
    private final DetailAttributeRepository attributeRepo;
    private final ShapeTypeMappingRepository shapeTypeMappingRepo;
    private final ShapeAttributeMappingRepository shapeAttributeMappingRepo;
    public DetailController(DetailRepository detailRepo, UserRepository userRepo,
                            DetailAttributeValuesRepository attributeValueRepo, DetailAttributeRepository attributeRepo,
                            ShapeTypeMappingRepository shapeTypeMappingRepo, ShapeAttributeMappingRepository shapeAttributeMappingRepository)
    {
        this.detailRepo = detailRepo;
        this.userRepo = userRepo;
        this.attributeValueRepo = attributeValueRepo;
        this.attributeRepo = attributeRepo;
        this.shapeTypeMappingRepo = shapeTypeMappingRepo;
        this.shapeAttributeMappingRepo = shapeAttributeMappingRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createDetail(@RequestBody DetailWithAttributesRequest request, Authentication authentication)
    {
        String username = authentication.getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Проверка допустимости типа для формы
        if (!shapeTypeMappingRepo.existsByShapeAndType(request.getShape(), request.getType())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", 400,
                    "error", "Тип \"" + request.getType() + "\" не допустим для формы \"" + request.getShape() + "\""
            ));
        }

        // Сохраняем деталь
        Detail detail = new Detail();
        detail.setName(request.getName());
        detail.setNumber(request.getNumber());
        detail.setOrderNumber(request.getOrderNumber());
        detail.setShape(request.getShape());
        detail.setType(request.getType());
        detail.setUser(user);

        Detail savedDetail = detailRepo.save(detail);

        // Обрабатываем значения атрибутов
        for (DetailAttributeValueRequest attrRequest : request.getAttributes()) {
            DetailAttributes attribute = attributeRepo.findById(attrRequest.getAttributeId())
                    .orElseThrow(() -> new RuntimeException("Attribute not found"));

            boolean allowed = shapeAttributeMappingRepo.existsByShapeAndAttribute(request.getShape(), attribute);
            if (!allowed) {
                return ResponseEntity.badRequest().body(Map.of(
                        "status", 400,
                        "error", "Атрибут \"" + attribute.getName() + "\" не допустим для формы \"" + request.getShape() + "\""
                ));
            }

            DetailAttributeValues value = new DetailAttributeValues();
            value.setDetail(savedDetail);
            value.setAttribute(attribute);
            value.setValue(attrRequest.getValue());
            value.setUser(user);
            attributeValueRepo.save(value);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "status", 201,
                "message", "Деталь и атрибуты успешно сохранены",
                "detailId", savedDetail.getId()
        ));
    }


//    @GetMapping("details/{id}")
//    public ResponseEntity<?> getDetail(@PathVariable Long id, Authentication authentication)
//    {
//        String username = authentication.getName();
//        User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
//
//        Detail detail = detailRepo.findById(id)
//                .orElseThrow(() -> new RuntimeException("Detail not found"));
//
//
//        List<DetailAttributeValues> attributeValues = attributeValueRepo.findByDetail(detail);
//
//        List<DetailAttributeValueDTO> values = new ArrayList<>();
//
//        for (DetailAttributeValues dav : attributeValues) {
//            String attributeName = dav.getAttribute().getName();
//            String attributeUnit = dav.getAttribute().getUnit();
//            String attributeValue = dav.getValue();
//
//            if (attributeName != null && !attributeName.isEmpty()
//                    && attributeUnit != null && !attributeUnit.isEmpty()) {
//
//                DetailAttributeValueDTO value = new DetailAttributeValueDTO(
//                        attributeName, attributeValue, attributeUnit
//                );
//                values.add(value);
//            }
//        }
//
//        DetailWithAttributesResponse response = new DetailWithAttributesResponse(detail.getId(), detail.getName(),
//                detail.getNumber(), detail.getOrderNumber(), detail.getShape(),values);
//
//        return ResponseEntity.ok(Map.of("status", "OK",
//                "message", "Successful",
//                "data", response));
//    }

    @GetMapping("/shapes")
    public ResponseEntity<?> getAllShapes() {
        List<String> shapes = shapeTypeMappingRepo.findDistinctShapes();
        return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                "status", 200,
                "message", "Successful",
                "data", shapes
        ));
    }

    @GetMapping("/types")
    public ResponseEntity<?> getTypesByShape(@RequestParam String shape) {
        {
            List<String> types = shapeTypeMappingRepo.findTypesByShape(shape);

            if (types == null || types.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT)
                        .body(Map.of(
                                "status", 204,
                                "message", "Типи для форми \"" + shape + "\" не знайдені"
                        ));
            }

            return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                    "status", 200,
                    "message", "Successful",
                    "data", types
            ));
        }
    }

    @PostMapping("/shapes/add-types")
    public ResponseEntity<?> addShapeTypeMapping(@RequestBody ShapeTypeRequest request) {
        boolean exists = shapeTypeMappingRepo.existsByShapeAndType(request.getShape(), request.getType());
        if (exists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    Map.of("status", 409, "message", "Такая связка уже существует")
            );
        }

        ShapeTypeMapping mapping = new ShapeTypeMapping();
        mapping.setShape(request.getShape());
        mapping.setType(request.getType());

        shapeTypeMappingRepo.save(mapping);

        return ResponseEntity.ok(Map.of(
                "status", 200,
                "message", "Связка форма-тип добавлена",
                "shape", request.getShape(),
                "type", request.getType()
        ));
    }
}