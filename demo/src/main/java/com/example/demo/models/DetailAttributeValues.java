package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "detail_attribute_values")
public class DetailAttributeValues {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "detail_id")
    private Detail detail;

    @ManyToOne
    @JoinColumn(name = "attribute_id")
    private DetailAttributes attribute;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String value;
}
