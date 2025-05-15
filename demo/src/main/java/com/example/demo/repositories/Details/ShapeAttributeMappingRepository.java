package com.example.demo.repositories.Details;

import com.example.demo.models.Details.DetailAttributes;
import com.example.demo.models.Details.ShapeAttributeMapping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShapeAttributeMappingRepository extends JpaRepository<ShapeAttributeMapping, ShapeAttributeMapping.ShapeAttributeId> {
   List<ShapeAttributeMapping> findByShape(String shape);
   boolean existsByShapeAndAttribute(String shape, DetailAttributes attribute);
}
