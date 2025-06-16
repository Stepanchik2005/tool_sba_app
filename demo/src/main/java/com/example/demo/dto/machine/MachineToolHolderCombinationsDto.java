package com.example.demo.dto.machine;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MachineToolHolderCombinationsDto {
    private Long id;
    private String standard;
    private String holderType;
    private String pullStudType;
}
