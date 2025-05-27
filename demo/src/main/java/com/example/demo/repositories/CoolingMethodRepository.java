package com.example.demo.repositories;

import com.example.demo.models.CoolingMethod;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoolingMethodRepository extends JpaRepository<CoolingMethod, Long> {}
