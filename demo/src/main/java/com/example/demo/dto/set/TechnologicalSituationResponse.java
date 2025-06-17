package com.example.demo.dto.set;


import com.example.demo.dto.ProcessingMethodResponse;
import com.example.demo.dto.ProcessingTypeNodeResponse;
import com.example.demo.dto.detail.DetailResponse;
import com.example.demo.models.Process.ProcessingMethod;

public record TechnologicalSituationResponse(Long id, DetailResponse detail, ProcessingMethodResponse processingMethod,
                                             ProcessingTypeNodeResponse processingTypeNode,
                                             List<ProcessingTypeAttributeValueDTO> attributes) {
}
