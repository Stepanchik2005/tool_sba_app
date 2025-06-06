package com.example.demo.dto;

public record TechnologicalSolutionResponse(
        Long id,
        String username,
        String detailName,
        String machineModel,
        Long processingTypeId,
        String processingMethodName,
        Long setId
) {}

