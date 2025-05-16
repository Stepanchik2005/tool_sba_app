package com.example.demo.repositories.Machines;

import com.example.demo.models.Machine.MachineAttributeOption;
import com.example.demo.models.Machine.MachineAttributes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MachineAttributeOptionRepository extends JpaRepository<MachineAttributeOption, Long> {
    List<MachineAttributeOption> findByAttribute(MachineAttributes attribute);
}
