package com.example.demo.models.Process;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.util.List;

@Data
@Entity
@Table(name = "processing_type")
@ToString(exclude = {"parent", "children"})
public class ProcessingType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private ProcessingType parent;

    @OneToMany(mappedBy = "parent")
    private List<ProcessingType> children;
}
