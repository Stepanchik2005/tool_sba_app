package com.example.demo.dto.machine;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class MachineAttributeRequest {
    @NotBlank(message = "Name is required")
    private String name;
    private String unit;
    private String inputType;       // "text", "number", "select"
    private String machineType;     // например "токарный"
    private List<String> options;
}
