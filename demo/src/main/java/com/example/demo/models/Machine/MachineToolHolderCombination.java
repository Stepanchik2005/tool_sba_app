package com.example.demo.models.Machine;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "machine_tool_holder_combinations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MachineToolHolderCombination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "standard", nullable = false)
    private String standard;

    @Column(name = "holder_type", nullable = false)
    private String holderType;

    @Column(name = "pull_stud_type", nullable = false)
    private String pullStudType;
}
