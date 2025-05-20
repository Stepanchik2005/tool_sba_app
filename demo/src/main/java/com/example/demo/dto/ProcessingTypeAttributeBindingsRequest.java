package com.example.demo.dto;

import lombok.Data;

@Data
public class ProcessingTypeAttributeBindingsRequest {
    private Long typeId;
    private String attributeName;
    private String unit;
    private boolean isRequired;
    private String methodName;
}
