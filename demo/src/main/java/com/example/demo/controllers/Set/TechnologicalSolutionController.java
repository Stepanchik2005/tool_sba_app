package com.example.demo.controllers.Set;

import com.example.demo.Selenium.ProductInfo;
import com.example.demo.Selenium.SiteStrategy;
import com.example.demo.Selenium.SiteStrategyFactory;
import com.example.demo.dto.TechnologicalSolutionRequest;
import com.example.demo.dto.TechnologicalSolutionResponse;
import com.example.demo.dto.set.*;
import com.example.demo.models.Material;
import com.example.demo.models.Set.*;
import com.example.demo.models.TechnologicalSituation;
import com.example.demo.models.TechnologicalSolution;
import com.example.demo.models.User;
import com.example.demo.repositories.*;
import com.example.demo.repositories.Details.DetailRepository;
import com.example.demo.repositories.Machines.MachineRepository;
import com.example.demo.repositories.Set.SetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;
import java.util.Set;

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
        Pageable top3 = PageRequest.of(0, 3);
        List<TechnologicalSolution> top3Situation = techSolRepo.findTopSituations(processingMethodId, processingTypeId, materialId, top3);
        if (top3Situation.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                            "status", HttpStatus.NOT_FOUND.value(),
                            "error", "Not found"
                            ));
        }

        List<SuggestedSetsResponse> responses = top3Situation.stream().map(m -> {
            SuggestedSetsResponse response = toSuggestedSetRepsonse(m.getSet());
            return response;
        }).toList();


        return  ResponseEntity.status(HttpStatus.OK).body(Map.of(
                "status", HttpStatus.OK.value(),
                "message", "Successfully getting",
                "data", responses
        ));
    }

    private ProductInfo findPriceAndAvailability(SetObject obj) {
        SiteStrategyFactory factory = new SiteStrategyFactory();
        SiteStrategy strategy = factory.resolveStrategy(obj.getLink());
        ProductInfo holderFetch;
        try {
            holderFetch = strategy.fetch(obj.getLink(), obj.getArticleNumber());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return holderFetch;
    }

    private <T extends SetObjectResponse> T setResponse(T response, SetObject obj, WebsiteData websiteData)
    {
        response.setId(obj.getId());
        response.setName(obj.getName());
        response.setMarking(obj.getMarking());
        response.setArticleNumber(obj.getArticleNumber());
        response.setLink(obj.getLink());
        response.setSupplierName(obj.getSupplier().getName());
        response.setBrandName(obj.getBrand().getName());
        response.setWebsiteData(websiteData);
        return response;
    }
    private WebsiteData createWebsiteData(ProductInfo info)
    {
        return new WebsiteData(info.price(),info.isAvailable());
    }
    private SuggestedSetsResponse toSuggestedSetRepsonse(SetEntity set)
    {
        ToolHolder holder = set.getToolHolder();
        Instrument instrument = set.getInstrument();
        ToolAdapter toolAdapter = (set.getToolAdapter() != null) ? set.getToolAdapter() : null;

        ProductInfo holderInfo = findPriceAndAvailability(holder);
        ProductInfo instrumentInfo = findPriceAndAvailability(instrument);
        ProductInfo adapterInfo = toolAdapter != null ? findPriceAndAvailability(toolAdapter) : null;

        ToolAdapterResponse toolAdapterResponse = null;
        WebsiteData websiteHolderData = createWebsiteData(holderInfo);
        WebsiteData websiteInstrumentData = createWebsiteData(instrumentInfo);
        WebsiteData websiteAdapterData = adapterInfo != null ? createWebsiteData(adapterInfo) : null;


        ToolHolderResponse holderResponse = setResponse(new ToolHolderResponse(), holder, websiteHolderData);
        InstrumentResponse instrumentResponse = setResponse(new InstrumentResponse(), instrument, websiteInstrumentData);
        if(toolAdapter != null && websiteAdapterData != null)
        {
            toolAdapterResponse = setResponse(new ToolAdapterResponse(), toolAdapter, websiteAdapterData);
        }

        SuggestedSetsResponse response = new SuggestedSetsResponse(
                holderResponse,
                instrumentResponse,
                toolAdapterResponse // може бути null — і це ок
        );

        return response;
    }
}
