package com.example.demo.dto.set;


import com.example.demo.dto.ProcessingMethodResponse;
import com.example.demo.dto.ProcessingTypeAttributeValueResponse;
import com.example.demo.dto.ProcessingTypeNodeResponse;
import com.example.demo.dto.detail.DetailResponse;
import com.example.demo.dto.material.MaterialResponse;
import com.example.demo.models.Process.ProcessingMethod;

import java.util.List;

public record TechnologicalSituationResponse(Long id, DetailResponse detail, ProcessingMethodResponse processingMethod,
                                             ProcessingTypeNodeResponse processingTypeNode, MaterialResponse material,
                                             SetResponse set,  List<ProcessingTypeAttributeValueResponse> attributes) {
}
