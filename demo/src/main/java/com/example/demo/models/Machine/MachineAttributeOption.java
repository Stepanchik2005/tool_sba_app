package com.example.demo.models.Machine;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "machine_attribute_option")
public class  MachineAttributeOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String value;

    @ManyToOne
    @JoinColumn(name = "attribute_id", nullable = false)
    private MachineAttributes attribute;
}
