package com.example.demo.repositories.Set;

import com.example.demo.models.Set.SetEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SetRepository extends JpaRepository<SetEntity, Long> {
}