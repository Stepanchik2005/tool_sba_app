package com.example.demo.repositories;

import com.example.demo.models.Detail;
import com.example.demo.models.DetailAttributes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DetailAttributeRepository extends JpaRepository<DetailAttributes, Long> {

    List<DetailAttributes> findByShape(String shape);
}
