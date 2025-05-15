package com.example.demo.repositories;

import com.example.demo.models.Material;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    Optional<Material> findByBrand(String brand);
}
