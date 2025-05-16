package com.example.demo.models.Machine;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "machine_attributes")
public class MachineAttributes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String unit;
    private String inputType;

    @OneToMany(mappedBy = "attribute", cascade = CascadeType.ALL)
    List<MachineAttributeOption> options;
}
