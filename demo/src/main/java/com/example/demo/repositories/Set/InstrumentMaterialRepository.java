package com.example.demo.repositories.Set;

import com.example.demo.models.InstrumentMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InstrumentMaterialRepository extends JpaRepository<InstrumentMaterial, Long> {
    List<InstrumentMaterial> findByInstrumentId(Long instrumentId);
}
