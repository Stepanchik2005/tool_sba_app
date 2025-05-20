package com.example.demo.repositories;

import com.example.demo.models.ProcessingTypeAttributeBindings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProcessingTypeAttributeBindingsRepository extends JpaRepository<ProcessingTypeAttributeBindings, Long> {
    @Query(""" 
            SELECT b FROM ProcessingTypeAttributeBindings b 
            WHERE b.processingMethod.id = :method AND b.processingType.id = :parentId
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
}
