package com.example.demo.repositories;

import com.example.demo.models.ProcessingMethod;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProcessingMethodRepository extends JpaRepository<ProcessingMethod, Long> {

    Optional<ProcessingMethod> findByName(String name);
}

