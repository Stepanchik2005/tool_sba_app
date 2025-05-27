package com.example.demo.dto;

import lombok.Data;

@Data
public class ProcessingTypeAttributeBindingsRequest {
    private Long typeId;
    private Long attributeId;
    private String name;
    private String unit;
    private Boolean isRequired;
    private String methodName;
}
