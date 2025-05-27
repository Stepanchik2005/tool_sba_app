package com.example.demo.dto.machine;

import java.util.List;

public record MachineHistoryDTO(
        Long id,
        String inventoryNumber,
        String workshopNumber,
        String type,
        String model,
        String chpkSystem,
        List<MachineAttributesDTO> attributes
) {
    public record MachineAttributesDTO(String name, String unit,String value){}
}
