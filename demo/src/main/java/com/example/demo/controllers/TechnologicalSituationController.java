package com.example.demo.controllers;

import com.example.demo.dto.TechnologicalSituationRequest;
import com.example.demo.models.*;

import com.example.demo.repositories.*;
import com.example.demo.repositories.Details.DetailRepository;
import com.example.demo.repositories.Machines.MachineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/technological-situation")
@RequiredArgsConstructor
public class TechnologicalSituationController {

    private final TechnologicalSituationRepository technologicalSituationRepo;
    private final DetailRepository detailRepo;
    private final MachineRepository machineRepo;
    private final ProcessingMethodRepository methodRepo;
    private final ProcessingTypeRepository processingTypeRepo;
    private final CoolingTypeRepository coolingTypeRepo;
    private final CoolingMethodRepository coolingMethodRepo;
    private final UserRepository userRepo;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody TechnologicalSituationRequest request, Authentication auth) {
        User user = userRepo.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        TechnologicalSituation ts = new TechnologicalSituation();
        ts.setDetail(detailRepo.findById(request.detailId())
                .orElseThrow(() -> new RuntimeException("Detail not found")));
        ts.setMachine(machineRepo.findById(request.machineId())
                .orElseThrow(() -> new RuntimeException("Machine not found")));
        ts.setProcessingMethod(methodRepo.findById(request.processingMethodId())
                .orElseThrow(() -> new RuntimeException("Method not found")));
        ts.setProcessingType(processingTypeRepo.findById(request.processingTypeId())
                .orElseThrow(() -> new RuntimeException("Type not found")));

        ts.setCoolingType(coolingTypeRepo.findById(request.coolingTypeId())
                .orElseThrow(() -> new RuntimeException("Cooling type not found")));

        ts.setCoolingMethod(coolingMethodRepo.findById(request.coolingMethodId())
                .orElseThrow(() -> new RuntimeException("Cooling method not found")));

        ts.setUser(user);
        technologicalSituationRepo.save(ts);

        return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                "status", 200,
                "message", "Технологічне рішення збережено успішно"
        ));
    }
}
