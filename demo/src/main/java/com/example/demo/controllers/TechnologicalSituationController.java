package com.example.demo.controllers;

import com.example.demo.dto.*;
import com.example.demo.dto.detail.DetailResponse;
import com.example.demo.dto.material.MaterialResponse;
import com.example.demo.dto.set.*;
import com.example.demo.models.*;

import com.example.demo.models.Process.ProcessingTypeAttributeValues;
import com.example.demo.models.Set.*;
import com.example.demo.repositories.*;
import com.example.demo.repositories.Details.DetailRepository;
import com.example.demo.repositories.Machines.MachineRepository;
import com.example.demo.repositories.Set.SetRepository;
import com.example.demo.services.SuggestedSetsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
    private final MaterialRepository materialRepo;
    private final SetRepository setRepo;

    private final SuggestedSetsService setsService;
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

        ts.setMaterial(materialRepo.findById(request.materialId())
                .orElseThrow(() -> new RuntimeException("Material not found")));

        ts.setUser(user);
        TechnologicalSituation saved = technologicalSituationRepo.save(ts);

        return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                "status", 200,
                "message", "Технологічне рішення збережено успішно",
                "id", saved.getId()
        ));
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAll(@RequestParam Long detailId,Authentication auth)
    {
        User user = userRepo.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<TechnologicalSituation> situations = technologicalSituationRepo
                .findAllByDetailIdAndUserId(detailId, user.getId());


        List<TechnologicalSituationResponse> responses = situations.stream().map((m) ->{
            DetailResponse detailResponse = new DetailResponse(m.getDetail().getId(),
                    m.getDetail().getName(), m.getDetail().getNumber(), m.getDetail().getOrderNumber(),
                    m.getDetail().getShape());

            ProcessingMethodResponse processingMethodResponse = new ProcessingMethodResponse(m.getProcessingMethod().getId(),
                    m.getProcessingMethod().getName());

            ProcessingTypeNodeResponse processingTypeNodeResponse = new ProcessingTypeNodeResponse();
            processingTypeNodeResponse.setId(m.getProcessingType().getId());
            processingTypeNodeResponse.setUrl(m.getProcessingType().getUrl());
            processingTypeNodeResponse.setLeaf(false); // неважно что

            MaterialResponse materialResponse = new MaterialResponse(m.getMaterial().getId(),
                    m.getMaterial().getBrand(), m.getMaterial().getHardness(), m.getMaterial().getGroupIso(),
                    m.getMaterial().getHardnessSpan());

            List<ProcessingTypeAttributeValues> attributeValues = m.getAttributes();

            List<ProcessingTypeAttributeValueResponse> attributeValueResponses = attributeValues.stream()
                    .map(v -> new ProcessingTypeAttributeValueResponse(
                            v.getProcessingTypeAttributes().getName(),
                            v.getValue(),
                            v.getProcessingTypeAttributes().getUnit()
                    ))
                    .toList();

            SetEntity set = m.getSet();
            ToolHolder toolHolder = set.getToolHolder();
            Instrument instrument = set.getInstrument();
            ToolAdapter toolAdapter = set.getToolAdapter();
            WebsiteData toolHolderWebsiteData = setsService.getUserSetWebsiteData(toolHolder);
            WebsiteData instrumentWebsiteData = setsService.getUserSetWebsiteData(instrument);
            WebsiteData toolAdapterWebsiteData = (toolAdapter != null ? setsService.getUserSetWebsiteData(toolAdapter) : null); ;

            // 🔐 Перевірка: якщо adapter є — створюємо ToolAdapterResponse, інакше залишаємо null
            ToolAdapterResponse adapterResponse = null;
            if (toolAdapter != null) {
                adapterResponse = new ToolAdapterResponse(
                        toolAdapter.getId(),
                        toolAdapter.getName(),
                        toolAdapter.getMarking(),
                        toolAdapter.getArticleNumber(),
                        toolAdapter.getLink(),
                        new SupplierResponse(
                                toolAdapter.getSupplier().getId(),
                                toolAdapter.getSupplier().getEmail(),
                                toolAdapter.getSupplier().getName(),
                                toolAdapter.getSupplier().getMobile(),
                                toolAdapter.getSupplier().getEdpou(),
                                toolAdapter.getSupplier().getAddress()
                        ),
                        toolAdapter.getBrand().getName(),
                        toolAdapterWebsiteData
                );
            }

            SetResponse setResponse = new SetResponse(
                    new ToolHolderResponse(
                            toolHolder.getId(),
                            toolHolder.getName(),
                            toolHolder.getMarking(),
                            toolHolder.getArticleNumber(),
                            toolHolder.getLink(),
                            new SupplierResponse(
                                    toolHolder.getSupplier().getId(),
                                    toolHolder.getSupplier().getEmail(),
                                    toolHolder.getSupplier().getName(),
                                    toolHolder.getSupplier().getMobile(),
                                    toolHolder.getSupplier().getEdpou(),
                                    toolHolder.getSupplier().getAddress()
                            ),
                            toolHolder.getBrand().getName(),
                            toolHolderWebsiteData
                    ),
                    new InstrumentResponse(
                            instrument.getId(),
                            instrument.getName(),
                            instrument.getMarking(),
                            instrument.getArticleNumber(),
                            instrument.getLink(),
                            instrument.getInstrumentMaterial(),
                            new SupplierResponse(
                                    instrument.getSupplier().getId(),
                                    instrument.getSupplier().getEmail(),
                                    instrument.getSupplier().getName(),
                                    instrument.getSupplier().getMobile(),
                                    instrument.getSupplier().getEdpou(),
                                    instrument.getSupplier().getAddress()
                            ),
                            instrument.getBrand().getName(),
                            instrumentWebsiteData
                    ),
                    adapterResponse // 🔄 може бути null
            );

            return new TechnologicalSituationResponse(m.getId(),
                    detailResponse, processingMethodResponse, processingTypeNodeResponse,materialResponse, setResponse, attributeValueResponses);


        }).toList();

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("status", HttpStatus.OK.value(),
                "data", responses));
    }


}
