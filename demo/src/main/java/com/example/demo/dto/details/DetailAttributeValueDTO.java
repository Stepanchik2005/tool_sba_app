package com.example.demo.dto.details;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DetailAttributeValueDTO {
    private String name;
    private String value;
    private String unit;
}
