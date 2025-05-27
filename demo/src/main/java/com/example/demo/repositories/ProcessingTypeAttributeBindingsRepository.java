package com.example.demo.repositories;

import com.example.demo.models.Process.ProcessingTypeAttributeBindings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProcessingTypeAttributeBindingsRepository extends JpaRepository<ProcessingTypeAttributeBindings, Long> {
    @Query(""" 
            SELECT b FROM ProcessingTypeAttributeBindings b 
            WHERE b.processingMethod IS NULL AND b.processingType.id = :parentId
            """)
    List<ProcessingTypeAttributeBindings> findByProcessingMethodIsNullAndParentId(@Param("parentId") Long parentId);

    @Query(""" 
            SELECT b FROM ProcessingTypeAttributeBindings b 
            WHERE b.processingMethod.id = :methodId
             AND b.processingType.id = :parentId
            """)
    List<ProcessingTypeAttributeBindings> findByProcessingMethodAndParentId(@Param("methodId") Long methodId,
                                                                            @Param("parentId") Long parentId);

    @Query(""" 
            SELECT b FROM ProcessingTypeAttributeBindings b 
            WHERE b.processingMethod.id = :methodId AND b.processingType.id = :parentId
            AND b.processingTypesAttributes.id = :attributeId
            """)
    Optional<ProcessingTypeAttributeBindings> findByProcessingMethodAndParentIdAndAttributeId(@Param("methodId") Long methodId,
                                                                                                @Param("parentId") Long parentId,
                                                                                              @Param("attributeId") Long attributeId);

    @Query("""
    SELECT b FROM ProcessingTypeAttributeBindings b 
    WHERE b.processingMethod IS NULL 
      AND b.processingType.id = :parentId
      AND b.processingTypesAttributes.id = :attributeId
""")
    Optional<ProcessingTypeAttributeBindings> findByProcessingMethodIsNullAndParentIdAndAttributeId(
            @Param("parentId") Long parentId,
            @Param("attributeId") Long attributeId);

    @Query(value = """
    SELECT DISTINCT ON (attribute_id) *
    FROM processing_type_attribute_bindings
    WHERE processing_type_id = :parentId
      AND (processing_method_id = :methodId OR processing_method_id IS NULL)
    ORDER BY attribute_id,
             CASE
                WHEN processing_method_id = :methodId THEN 1
                WHEN processing_method_id IS NULL THEN 2
                ELSE 3
             END
            
""", nativeQuery = true)
    List<ProcessingTypeAttributeBindings> findByParentIdAndMethodOrUniversal(
            @Param("parentId") Long parentId,
            @Param("methodId") Long methodId
    );



}
