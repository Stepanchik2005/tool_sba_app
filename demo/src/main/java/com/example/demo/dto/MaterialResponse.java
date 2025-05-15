package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MaterialResponse {
    private Long id;
    private String brand;
    private String hardness;
    private String groupIso;
    private String hardnessSpan;
}
