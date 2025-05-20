package com.example.demo.dto;

import com.example.demo.models.ProcessingMethod;
import lombok.Data;

@Data
public class ProcessingTypeAttributesRequest {
    private Long nodeId;
    private String methodName;
}
