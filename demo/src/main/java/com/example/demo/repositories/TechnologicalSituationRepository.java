package com.example.demo.repositories;

import com.example.demo.models.TechnologicalSituation;
import com.example.demo.models.TechnologicalSolution;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TechnologicalSituationRepository extends JpaRepository<TechnologicalSituation, Long> {

    // 🔍 Отримати всі рішення користувача
    List<TechnologicalSituation> findAllByUserId(Long userId);

    // (опційно) Отримати рішення по деталі + методу + типу
    List<TechnologicalSituation> findAllByDetailIdAndProcessingMethodIdAndProcessingTypeId(Long detailId, Long methodId, Long typeId);

    List<TechnologicalSituation> findAllByDetailIdAndUserId(Long detailId, Long userId);


    @Query("""
            SELECT ts FROM TechnologicalSituation ts
            JOIN FETCH ts.set s
            JOIN FETCH s.toolHolder
            JOIN FETCH s.instrument
            LEFT JOIN FETCH s.toolAdapter
            JOIN s.ratings sr
            JOIN InstrumentMaterial im ON im.instrument.id = s.instrument.id
            JOIN im.material m
            WHERE ts.processingMethod.id = :methodId
              AND ts.processingType.id = :typeId
              AND m.id = :materialId
              AND sr.rating = (
                SELECT MAX(sr2.rating)
                FROM SetRating sr2
                WHERE sr2.set.id = s.id
              )
""")
    List<TechnologicalSituation> findTopSituations(
            @Param("methodId") Long methodId,
            @Param("typeId") Long typeId,
            @Param("materialId") Long materialId,
            Pageable pageable
    );
}
