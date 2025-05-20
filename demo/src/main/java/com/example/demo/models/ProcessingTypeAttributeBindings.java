package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "processing_type_attribute_bindings")
public class ProcessingTypeAttributeBindings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "processing_type")
    private ProcessingType processingType;

    @ManyToOne
    @JoinColumn(name = "processing_type")
    private ProcessingMethod processingMethod;

    @ManyToOne
    @JoinColumn(name = "processing_type_attributes")
    private ProcessingTypeAttributes processingTypesAttributes;

    @Column(name = "is_required")
    private boolean isRequired;

}
