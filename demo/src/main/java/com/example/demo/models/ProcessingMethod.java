package com.example.demo.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "processing_method")
public class ProcessingMethod {
    private Long id;
    private String name;
}
