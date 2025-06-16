package com.example.demo.repositories.Machines;


import com.example.demo.models.Machine.MachineToolHolderCombination;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MachineToolHolderCombinationRepository extends JpaRepository<MachineToolHolderCombination, Long> {

    // Опционально: для фильтрации по стандарту
    List<MachineToolHolderCombination> findByStandard(String standard);
}
