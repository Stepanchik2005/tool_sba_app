package com.example.demo.models.Process;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "processing_method")
public class ProcessingMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
}
