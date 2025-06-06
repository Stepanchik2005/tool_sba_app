package com.example.demo.models;

import com.example.demo.models.Set.Instrument;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "instrument_material")
public class InstrumentMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "instrument_id", nullable = false)
    private Instrument instrument;

    @ManyToOne
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;
}

