package com.example.demo.models.Details;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "detail_attributes")
public class DetailAttributes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private String unit;
}
