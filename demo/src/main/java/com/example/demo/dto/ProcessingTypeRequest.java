package com.example.demo.dto;

import lombok.Data;

@Data
public class ProcessingTypeRequest {
    private String url;
    private Long parentId;
}
