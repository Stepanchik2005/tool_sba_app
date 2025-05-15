package com.example.demo.repositories.Details;

import com.example.demo.models.Details.DetailAttributes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DetailAttributeRepository extends JpaRepository<DetailAttributes, Long> {
    Optional<DetailAttributes> findByName(String name);
}
