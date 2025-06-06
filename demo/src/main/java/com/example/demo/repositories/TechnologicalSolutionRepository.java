package com.example.demo.repositories;

import com.example.demo.models.Set.SetEntity;

import com.example.demo.models.TechnologicalSolution;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TechnologicalSolutionRepository extends JpaRepository<TechnologicalSolution, Long> {

    @Query("""
            SELECT ts FROM TechnologicalSolution ts
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
    List<TechnologicalSolution> findTopSituations(
            @Param("methodId") Long methodId,
            @Param("typeId") Long typeId,
            @Param("materialId") Long materialId,
            Pageable pageable
    );
}
