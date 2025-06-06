package com.example.demo.repositories.Set;

import com.example.demo.models.Set.Instrument;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface InstrumentRepository extends JpaRepository<Instrument, Long> {

    @Query("""
        SELECT i FROM Instrument i
        WHERE i.user.id = :userId AND i.supplier.id = :supplierId AND i.articleNumber = :articleNumber
    """)
    Optional<Instrument> findByUserIdAndSupplierIdAndArticleNumber(@Param("userId") Long userId,
                                                                   @Param("supplierId") Long supplierId,
                                                                   @Param("articleNumber") String articleNumber);
}