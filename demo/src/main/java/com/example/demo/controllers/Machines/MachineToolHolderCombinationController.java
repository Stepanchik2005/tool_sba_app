package com.example.demo.controllers.Machines;


import com.example.demo.dto.machine.MachineToolHolderCombinationsDto;
import com.example.demo.models.Machine.MachineToolHolderCombination;
import com.example.demo.repositories.Machines.MachineToolHolderCombinationRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/machine/tool-holder")
@AllArgsConstructor
public class MachineToolHolderCombinationController {
    private final MachineToolHolderCombinationRepository combinationRepository;


    @GetMapping("/combinations")
    public List<MachineToolHolderCombinationsDto> getAllCombinations() {
        List<MachineToolHolderCombination> combinations = combinationRepository.findAll();

       return combinations.stream().map(combination -> MachineToolHolderCombinationsDto.builder()
                       .id(combination.getId())
                       .standard(combination.getStandard())
                       .holderType(combination.getHolderType())
                       .pullStudType(combination.getPullStudType())
                       .build())
               .collect(Collectors.toList());
    }
}
