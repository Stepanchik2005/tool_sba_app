package com.example.demo.dto.machine;

import lombok.Data;

@Data
public class MachineAttributeValuesRequest {
    private Long attributeId;
    private String value;
}
