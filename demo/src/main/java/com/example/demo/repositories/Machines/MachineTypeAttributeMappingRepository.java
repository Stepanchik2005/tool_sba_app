package com.example.demo.repositories.Machines;

import com.example.demo.models.Machine.MachineTypeAttributeMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MachineTypeAttributeMappingRepository extends JpaRepository<MachineTypeAttributeMapping, Long> {
    List<MachineTypeAttributeMapping> findByType(String type);

    @Query("SELECT DISTINCT t.type FROM MachineTypeAttributeMapping t")
    List<String> findDistinctTypes();
}
