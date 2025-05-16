package com.example.demo.dto.material;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MaterialRequest {

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Hardness is required")
    private String hardness;

    @NotBlank(message = "Group_iso is required")
    private String groupIso;

    @NotBlank(message = "hardnessSpan is required")
    private String hardnessSpan;
}
