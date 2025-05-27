package com.example.demo.repositories.Machines;

import com.example.demo.models.Details.DetailAttributeValues;
import com.example.demo.models.Machine.MachineAttributeValues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MachineAttributeValuesRepository extends JpaRepository<MachineAttributeValues, Long> {
    @Query("""
          SELECT mav FROM MachineAttributeValues mav
          JOIN FETCH mav.machine d
          JOIN FETCH mav.attribute a
          WHERE mav.user.id = :userId
        """)
    List<MachineAttributeValues> findAllWithFullData(@Param("userId") Long userId);
}
