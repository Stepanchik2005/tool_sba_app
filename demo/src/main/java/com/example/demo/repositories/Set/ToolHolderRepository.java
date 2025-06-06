package com.example.demo.repositories.Set;



import com.example.demo.models.Set.Supplier;
import com.example.demo.models.Set.ToolHolder;
import com.example.demo.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ToolHolderRepository extends JpaRepository<ToolHolder, Long> {
    @Query("""
    SELECT t FROM ToolHolder t
    WHERE t.user.id = :userId AND t.supplier.id = :supplierId AND t.articleNumber = :articleNumber
        """)
    Optional<ToolHolder> findByUserIdAndSupplierIdAndArticleNumber(@Param("userId") Long userId,
                                                                   @Param("supplierId") Long supplierId,
                                                                   @Param("articleNumber") String articleNumber);

}
