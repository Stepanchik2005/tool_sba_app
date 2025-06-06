package com.example.demo.dto.set;

public record InstrumentRequest(String name, String marking, String articleNumber,
                                String link, Long supplierId, Long brandId, String instrumentMaterial,
                                Long materialId) {
}
