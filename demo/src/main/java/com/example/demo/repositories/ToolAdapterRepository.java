package com.example.demo.repositories;

import com.example.demo.models.Set.ToolAdapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ToolAdapterRepository extends JpaRepository<ToolAdapter, Long> {
    @Query("""
    SELECT a FROM ToolAdapter a
    WHERE a.user.id = :userId AND a.supplier.id = :supplierId AND a.articleNumber = :articleNumber
""")
    Optional<ToolAdapter> findByUserIdAndSupplierIdAndArticleNumber(@Param("userId") Long userId,
                                                                    @Param("supplierId") Long supplierId,
                                                                    @Param("articleNumber") String articleNumber);

}
