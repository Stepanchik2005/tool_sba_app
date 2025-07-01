package com.example.demo.controllers.Set;

import com.example.demo.Selenium.ProductInfo;
import com.example.demo.Selenium.SiteStrategy;
import com.example.demo.Selenium.SiteStrategyFactory;
import com.example.demo.dto.TechnologicalSolutionRequest;
import com.example.demo.dto.TechnologicalSolutionResponse;
import com.example.demo.dto.set.*;
import com.example.demo.models.Set.*;
import com.example.demo.models.TechnologicalSolution;
import com.example.demo.models.User;
import com.example.demo.repositories.*;
import com.example.demo.repositories.Details.DetailRepository;
import com.example.demo.repositories.Machines.MachineRepository;
import com.example.demo.repositories.Set.SetRepository;
import com.example.demo.services.SuggestedSetsService;
import lombok.RequiredArgsConstructor;
import org.openqa.selenium.NotFoundException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/technological-solution")
@RequiredArgsConstructor
public class TechnologicalSolutionController {
    private final TechnologicalSituationRepository technologicalSituationRepo;
    private final DetailRepository detailRepo;
    private final MachineRepository machineRepo;
    private final ProcessingMethodRepository methodRepo;
    private final ProcessingTypeRepository processingTypeRepo;
    private final UserRepository userRepo;
    private final SetRepository setRepo;
    private final TechnologicalSolutionRepository techSolRepo;

    private final SuggestedSetsService setsService;
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody TechnologicalSolutionRequest request, Authentication auth) {
        User user = userRepo.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        TechnologicalSolution ts = new TechnologicalSolution();
        ts.setDetail(detailRepo.findById(request.detailId())
                .orElseThrow(() -> new RuntimeException("Detail not found")));
        ts.setMachine(machineRepo.findById(request.machineId())
                .orElseThrow(() -> new RuntimeException("Machine not found")));
        ts.setProcessingMethod(methodRepo.findById(request.processingMethodId())
                .orElseThrow(() -> new RuntimeException("Method not found")));
        ts.setProcessingType(processingTypeRepo.findById(request.processingTypeId())
                .orElseThrow(() -> new RuntimeException("Type not found")));

        ts.setSet(setRepo.findById(request.setId()).orElseThrow(() -> new RuntimeException("Set not found")));

        ts.setUser(user);

        TechnologicalSolution saved = techSolRepo.save(ts);

        TechnologicalSolutionResponse response = new TechnologicalSolutionResponse(
                saved.getId(),
                saved.getUser().getUsername(),
                saved.getDetail().getName(),
                saved.getMachine().getModel(),
                saved.getProcessingType().getId(),
                saved.getProcessingMethod().getName(),
                saved.getSet().getId()
        );

        return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                "status", 200,
                "message", "Технологічне рішення збережено успішно",
                "data", response
        ));
    }

    @GetMapping("/set/suggested")
    public ResponseEntity<?> getSetByProcessingTypeIdAndProcessingMethodIdAndMaterialId( @RequestParam Long processingTypeId,
                                                                                         @RequestParam Long processingMethodId,
                                                                                         @RequestParam Long materialId)
    {
        try{
            List<SetResponse> responses = setsService.getSetByProcessingTypeIdAndProcessingMethodIdAndMaterialId(processingTypeId, processingMethodId, materialId);
            return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                    "status", HttpStatus.OK.value(),
                    "message", "Successfully getting",
                    "data", responses
            ));
        } catch (Exception ex)
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "status", HttpStatus.NOT_FOUND.value(),
                    "error", "Not found"
            ));
        }

    }




}
