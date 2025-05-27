package com.example.demo.models.Process;

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
    @JoinColumn(name = "processing_type_id")
    private ProcessingType processingType;

    @ManyToOne
    @JoinColumn(name = "processing_method_id")
    private ProcessingMethod processingMethod;

    @ManyToOne
    @JoinColumn(name = "attribute_id")
    private ProcessingTypeAttributes processingTypesAttributes;

    @Column(name = "is_required")
    private Boolean isRequired;

}
