package com.example.demo.controllers.Set;

import com.example.demo.dto.set.*;
import com.example.demo.models.Set.*;
import com.example.demo.models.TechnologicalSituation;
import com.example.demo.models.User;
import com.example.demo.repositories.Set.*;
import com.example.demo.repositories.TechnologicalSituationRepository;
import com.example.demo.repositories.ToolAdapterRepository;
import com.example.demo.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/set")
@RequiredArgsConstructor
public class SetController {

    private final ToolHolderRepository toolHolderRepository;
    private final InstrumentRepository instrumentRepository;
    private final ToolAdapterRepository toolAdapterRepository;
    private final SetRepository setRepository;
    private final UserRepository userRepository;
    private final TechnologicalSituationRepository situationRepository;


    @PostMapping("/create")
    public ResponseEntity<?> createSet(@RequestBody SetRequest request, Authentication auth) {
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ToolHolder holder = toolHolderRepository.findById(request.toolHolderId())
                .orElseThrow(() -> new RuntimeException("ToolHolder not found"));

        Instrument instrument = instrumentRepository.findById(request.instrumentId())
                .orElseThrow(() -> new RuntimeException("Instrument not found"));

        ToolAdapter adapter = null;

        if(request.toolAdapterId() != null)
        {
             adapter = toolAdapterRepository.findById(request.toolAdapterId())
                    .orElseThrow(() -> new RuntimeException("ToolAdapter not found"));
        }


        // TODO: додаткова перевірка на дублікати (за бажанням)

        SetEntity set = new SetEntity();
        set.setInstrument(instrument);

        if(adapter != null)
            set.setToolAdapter(adapter);

        set.setToolHolder(holder);
        set.setUser(user);

        SetEntity saved = setRepository.save(set);
        TechnologicalSituation situation = situationRepository.findById(request.situationId()).orElseThrow(() -> new RuntimeException("Situation not found"));
        situation.setSet(saved);
        situationRepository.save(situation);

        ToolHolder toolHolder = set.getToolHolder();
        Instrument setInstrument = set.getInstrument();
        ToolAdapter toolAdapter = set.getToolAdapter();
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
                    toolAdapter.getBrand().getName()
            );
        }

        SetResponse response = new SetResponse(
                new ToolHolderResponse(toolHolder.getId(), toolHolder.getName(), toolHolder.getMarking(), toolHolder.getArticleNumber(),
                        toolHolder.getLink(), new SupplierResponse(toolHolder.getSupplier().getId(), toolHolder.getSupplier().getEmail(),
                        toolHolder.getSupplier().getName(), toolHolder.getSupplier().getMobile(), toolHolder.getSupplier().getEdpou(),
                        toolHolder.getSupplier().getAddress()), toolHolder.getBrand().getName()),
                new InstrumentResponse(setInstrument.getId(), setInstrument.getName(), setInstrument.getMarking(), setInstrument.getArticleNumber(),
                        setInstrument.getLink(), setInstrument.getInstrumentMaterial(), new SupplierResponse(setInstrument.getSupplier().getId(), setInstrument.getSupplier().getEmail(),
                        setInstrument.getSupplier().getName(), setInstrument.getSupplier().getMobile(), setInstrument.getSupplier().getEdpou(),
                        setInstrument.getSupplier().getAddress()), setInstrument.getBrand().getName()),adapterResponse
                );
        //response.setId(saved.getId())

        return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                "status", HttpStatus.OK.value(),
                "message", "Set successfully created",
                "data", response
        ));
    }
}

