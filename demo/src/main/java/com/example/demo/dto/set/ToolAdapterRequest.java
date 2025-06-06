package com.example.demo.dto.set;

public record ToolAdapterRequest(String name, String marking, String articleNumber,
                                 String link, Long supplierId, Long brandId) {
}
