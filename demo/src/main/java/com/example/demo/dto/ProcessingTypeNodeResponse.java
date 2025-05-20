package com.example.demo.dto;


import lombok.Data;

@Data
public class ProcessingTypeNodeResponse {
    private Long id;
    private String url;
    private boolean leaf; // ← нужен, чтобы фронт знал: дальше запрашивать детей или атрибуты
}
