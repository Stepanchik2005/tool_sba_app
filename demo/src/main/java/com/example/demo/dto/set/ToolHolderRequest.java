package com.example.demo.dto.set;

public record ToolHolderRequest(String name, String marking, String articleNumber,
                                String link, Long supplierId, Long brandId) {
}
