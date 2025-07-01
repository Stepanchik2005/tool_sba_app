package com.example.demo.dto;

public record TechnologicalSituationRequest(
        Long detailId,
        Long machineId,
        Long processingMethodId,
        Long processingTypeId,
        Long coolingTypeId,
        Long coolingMethodId,
        Long materialId,
        Long setId
) {}
