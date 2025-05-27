package com.example.demo.models.Process;

import com.example.demo.models.CoolingMethod;
import com.example.demo.models.CoolingType;
import com.example.demo.models.Details.Detail;
import com.example.demo.models.User;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "processing_type_attribute_values")
public class ProcessingTypeAttributeValues {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @ManyToOne
    @JoinColumn(name = "processing_type_id")
    private ProcessingType processingType;

    @ManyToOne
    @JoinColumn(name = "processing_type_attributes_id")
    private ProcessingTypeAttributes processingTypeAttributes;

    @ManyToOne
    @JoinColumn(name = "detail_id", nullable = false)
    private Detail detail;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String value;

    @ManyToOne
    @JoinColumn(name = "cooling_method_id")
    private CoolingMethod coolingMethod;

    @ManyToOne
    @JoinColumn(name = "cooling_type_id")
    private CoolingType coolingType;

}
