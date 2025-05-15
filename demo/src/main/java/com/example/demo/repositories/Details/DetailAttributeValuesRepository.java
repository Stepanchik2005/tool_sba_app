package com.example.demo.repositories.Details;

import com.example.demo.models.Details.Detail;
import com.example.demo.models.Details.DetailAttributeValues;
import com.example.demo.models.Details.DetailAttributes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DetailAttributeValuesRepository extends JpaRepository<DetailAttributeValues, Long> {
    @Override
    Optional<DetailAttributeValues> findById(Long aLong);
    Optional<DetailAttributeValues> findByDetailAndAttribute(Detail detail, DetailAttributes attribute);

    List<DetailAttributeValues> findByDetail(Detail detail);

}
