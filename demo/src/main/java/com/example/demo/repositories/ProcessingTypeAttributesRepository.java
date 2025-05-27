package com.example.demo.repositories;

import com.example.demo.models.Process.ProcessingTypeAttributes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProcessingTypeAttributesRepository extends JpaRepository<ProcessingTypeAttributes, Long> {
    Optional<ProcessingTypeAttributes> findByName(String name);

}
