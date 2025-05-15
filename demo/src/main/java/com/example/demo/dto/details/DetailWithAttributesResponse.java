package com.example.demo.dto.details;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class DetailWithAttributesResponse {
    private Long id;
    private String name;
    private String number;
    private String orderNumber;
    private String shape;

    private List<DetailAttributeValueDTO> attributes;
}
