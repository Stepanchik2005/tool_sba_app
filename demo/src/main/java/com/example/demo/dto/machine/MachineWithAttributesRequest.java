package com.example.demo.dto.machine;

import com.example.demo.models.Machine.MachineAttributeValues;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class MachineWithAttributesRequest {
    private String inventoryNumber;
    private String workshopNumber;
    private String type;

    @NotBlank(message = "Model is required")
    private String model;
    private String chpkSystem;

    private List<MachineAttributeValuesRequest> attributes;
}
