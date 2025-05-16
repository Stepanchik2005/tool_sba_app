package com.example.demo.dto.machine;

import lombok.Data;

import java.util.List;

@Data
public class MachineAttributeResponse {
    private Long id;
    private String name;
    private String unit;
    private String inputType;
    private List<String> options;
}
