package com.example.demo.repositories.Machines;


import com.example.demo.models.Machine.MachineAttributes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MachineAttributesRepository extends JpaRepository<MachineAttributes, Long> {
    Optional<MachineAttributes> findByName(String name);

}
