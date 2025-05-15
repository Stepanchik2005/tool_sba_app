package com.example.demo.repositories.Details;

import com.example.demo.models.Details.ShapeAttributeMapping;
import com.example.demo.models.Details.ShapeTypeMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ShapeTypeMappingRepository extends JpaRepository<ShapeTypeMapping, ShapeTypeMapping.ShapeTypeId> {
    @Query("SELECT s.type FROM ShapeTypeMapping s WHERE s.shape = :shape")
    List<String> findTypesByShape(@Param("shape") String shape);


    boolean existsByShapeAndType(String shape, String type);

    @Query("SELECT DISTINCT s.shape FROM ShapeTypeMapping s")
    List<String> findDistinctShapes();
}

