package com.example.demo.dto.detail;

// DetailHistoryDTO.java
import java.util.List;

public record DetailHistoryDTO(
        Long id,
        String number,
        String name,
        String orderNumber,
        String type,
        String shape,
        List<AttributeValueDTO> attributes
) {
    public record AttributeValueDTO(String name, String unit, String value) {}
}

