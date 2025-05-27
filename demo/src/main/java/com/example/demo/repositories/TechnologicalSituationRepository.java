package com.example.demo.repositories;

import com.example.demo.models.TechnologicalSituation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TechnologicalSituationRepository extends JpaRepository<TechnologicalSituation, Long> {

    // 🔍 Отримати всі рішення користувача
    List<TechnologicalSituation> findAllByUserId(Long userId);

    // (опційно) Отримати рішення по деталі + методу + типу
    List<TechnologicalSituation> findAllByDetailIdAndProcessingMethodIdAndProcessingTypeId(Long detailId, Long methodId, Long typeId);
}
