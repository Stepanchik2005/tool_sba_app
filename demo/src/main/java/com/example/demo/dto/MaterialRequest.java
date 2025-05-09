package com.example.demo.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MaterialRequest {

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Hardness is required")
    private String hardness;

    @NotBlank(message = "Group_iso is required")
    private String group_iso;
}
