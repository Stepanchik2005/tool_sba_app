package com.example.demo.repositories.Machines;

import com.example.demo.models.Machine.Machine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MachineRepository extends JpaRepository<Machine, Long> {

}
