package com.example.demo.repositories;

import com.example.demo.models.Process.ProcessingTypeAttributeValues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProcessingTypeAttributeValuesRepository extends JpaRepository<ProcessingTypeAttributeValues, Long> {
    @Query
            ("""
               SELECT COUNT(v) > 0 FROM ProcessingTypeAttributeValues v  
               WHERE v.processingType.id = :typeId AND v.processingTypeAttributes.id = :attributeId
                AND v.detail.id = :detailId AND v.user.id = :userId AND v.value = :value
                    """)
    Boolean exists(@Param("typeId") Long typeId,
                   @Param("attributeId") Long attributeId,
                   @Param("detailId") Long detailId,
                   @Param("userId") Long userId,
                   @Param("value") String value);
}
