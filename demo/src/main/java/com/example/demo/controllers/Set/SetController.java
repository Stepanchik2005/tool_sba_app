package com.example.demo.controllers.Set;

import com.example.demo.dto.set.SetRequest;
import com.example.demo.dto.set.SetResponse;
import com.example.demo.models.Set.*;
import com.example.demo.models.User;
import com.example.demo.repositories.Set.*;
import com.example.demo.repositories.ToolAdapterRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/set")
public class SetController {

    private final ToolHolderRepository toolHolderRepository;
    private final InstrumentRepository instrumentRepository;
    private final ToolAdapterRepository toolAdapterRepository;
    private final SetRepository setRepository;
    private final UserRepository userRepository;

    public SetController(ToolHolderRepository toolHolderRepository,
                         InstrumentRepository instrumentRepository,
                         ToolAdapterRepository toolAdapterRepository,
                         SetRepository setRepository,
                         UserRepository userRepository) {
        this.toolHolderRepository = toolHolderRepository;
        this.instrumentRepository = instrumentRepository;
        this.toolAdapterRepository = toolAdapterRepository;
        this.setRepository = setRepository;
        this.userRepository = userRepository;
    }

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

        SetResponse response = new SetResponse();
        response.setId(saved.getId());

        response.setInstrument(new SetResponse.InstrumentDTO(
                saved.getInstrument().getId(),
                saved.getInstrument().getName(),
                saved.getInstrument().getMarking(),
                saved.getInstrument().getArticleNumber(),
                saved.getInstrument().getLink(),
                saved.getInstrument().getBrand() != null ? saved.getInstrument().getBrand().getName() : null,
                saved.getInstrument().getSupplier() != null ? saved.getInstrument().getSupplier().getName() : null
        ));

        response.setToolHolder(new SetResponse.ToolHolderDTO(
                saved.getToolHolder().getId(),
                saved.getToolHolder().getName(),
                saved.getToolHolder().getMarking(),
                saved.getToolHolder().getArticleNumber(),
                saved.getToolHolder().getLink(),
                saved.getToolHolder().getBrand() != null ? saved.getToolHolder().getBrand().getName() : null,
                saved.getToolHolder().getSupplier() != null ? saved.getToolHolder().getSupplier().getName() : null
        ));

        if(adapter != null)
        {
            response.setToolAdapter(new SetResponse.ToolAdapterDTO(
                    saved.getToolAdapter().getId(),
                    saved.getToolAdapter().getName(),
                    saved.getToolAdapter().getMarking(),
                    saved.getToolAdapter().getArticleNumber(),
                    saved.getToolAdapter().getLink(),
                    saved.getToolAdapter().getBrand() != null ? saved.getToolAdapter().getBrand().getName() : null,
                    saved.getToolAdapter().getSupplier() != null ? saved.getToolAdapter().getSupplier().getName() : null
            ));
        }


        response.setUser(new SetResponse.UserDTO(
                saved.getUser().getId(),
                saved.getUser().getUsername(),
                saved.getUser().getRole()
        ));


        return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                "status", HttpStatus.OK.value(),
                "message", "Set successfully created",
                "data", response
        ));
    }
}

