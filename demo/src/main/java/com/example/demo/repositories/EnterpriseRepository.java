package com.example.demo.repositories;

import com.example.demo.models.Enterprise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EnterpriseRepository extends JpaRepository<Enterprise, Long> {
    Optional<Enterprise> findByName(String name);
}
