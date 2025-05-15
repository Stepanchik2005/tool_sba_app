package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "material")
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String hardness;

    @Column(name = "group_iso", nullable = false)
    private String groupIso;

    @Column(name = "hardness_span", nullable = false)
    private String hardnessSpan;

}
