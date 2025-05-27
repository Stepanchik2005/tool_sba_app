package com.example.demo.repositories;

import com.example.demo.models.Process.ProcessingType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProcessingTypeRepository extends JpaRepository<ProcessingType, Long> {
    @Query("""
            SELECT pt FROM ProcessingType pt
            WHERE pt.id NOT IN (SELECT DISTINCT p.parent.id FROM ProcessingType p WHERE p.parent IS NOT NULL)
            """)
    List<ProcessingType> findAllLeafTypes();

    // Получить детей по parentId (или null для корня)
    @Query("""
        SELECT pt FROM ProcessingType pt
        WHERE (:parentId IS NULL AND pt.parent IS NULL)
           OR (pt.parent.id = :parentId)
    """)
    List<ProcessingType> findByParentId(@Param("parentId") Long parentId);

    // Получить id всех узлов, которые являются чьими-то родителями
    @Query("""
        SELECT DISTINCT pt.parent.id FROM ProcessingType pt
        WHERE pt.parent IS NOT NULL
    """)
    List<Long> findAllParentIds();

    @Query("""
        SELECT pt.url FROM ProcessingType pt
        WHERE pt.url = :url
    """)
    Optional<ProcessingType> findByUrl(@Param("url")String url);
}
