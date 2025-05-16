package com.example.demo.controllers.Machines;

import com.example.demo.dto.machine.MachineAttributeRequest;
import com.example.demo.dto.machine.MachineAttributeResponse;
import com.example.demo.models.Machine.MachineAttributeOption;
import com.example.demo.models.Machine.MachineAttributes;
import com.example.demo.models.Machine.MachineTypeAttributeMapping;
import com.example.demo.models.User;
import com.example.demo.repositories.Machines.MachineAttributeOptionRepository;
import com.example.demo.repositories.Machines.MachineAttributesRepository;
import com.example.demo.repositories.Machines.MachineTypeAttributeMappingRepository;
import com.example.demo.repositories.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/machine_attribute")
public class MachineAttributeConroller {
    private final UserRepository userRepo;
    private final MachineAttributesRepository machineAttributesRepo;
    private final MachineTypeAttributeMappingRepository machineTypeAttributeMappingRepo;
    private final MachineAttributeOptionRepository machineAttributeOptionRepo;
    public MachineAttributeConroller(UserRepository userRepo, MachineAttributesRepository machineAttributesRepo,
                                     MachineTypeAttributeMappingRepository machineTypeAttributeMappingRepo,
                                     MachineAttributeOptionRepository machineAttributeOptionRepo){
        this.userRepo = userRepo;
        this.machineAttributesRepo = machineAttributesRepo;
        this.machineTypeAttributeMappingRepo = machineTypeAttributeMappingRepo;
        this.machineAttributeOptionRepo = machineAttributeOptionRepo;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createAttribute(@RequestBody MachineAttributeRequest request, Authentication authentication)
    {
        String username = authentication.getName();
        User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        Optional<MachineAttributes> existing = machineAttributesRepo.findByName(request.getName());

        if(existing.isPresent()){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "status", HttpStatus.CONFLICT.value(),
                    "error", "Атрибут с названием \"" + request.getName() + "\" уже существует"
            ));
        }

        MachineAttributes attribute = new MachineAttributes();
        attribute.setUnit(request.getUnit());
        attribute.setName(request.getName());
        attribute.setInputType(request.getInputType());

        MachineAttributes saved = machineAttributesRepo.save(attribute);

        MachineTypeAttributeMapping mapping = new MachineTypeAttributeMapping();
        mapping.setAttribute(saved);
        mapping.setType(request.getMachineType());

        machineTypeAttributeMappingRepo.save(mapping);

        // 📥 СОЗДАЕМ ВАРИАНТЫ (если это select)
        if ("select".equalsIgnoreCase(request.getInputType()) && request.getOptions() != null) {
            for (String value : request.getOptions()) {
                MachineAttributeOption option = new MachineAttributeOption();
                option.setAttribute(saved);
                option.setValue(value);
                machineAttributeOptionRepo.save(option);
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "status", HttpStatus.CREATED.value(),
                "message", "Attribute created",
                "data", attribute
        ));

    }

    @GetMapping("/by-type")
    public ResponseEntity<?> getAttributeByType(@RequestParam String type, Authentication authentication)
    {
        String username = authentication.getName();
        User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        List<MachineTypeAttributeMapping> mappings = machineTypeAttributeMappingRepo.findByType(type);
        List<MachineAttributeResponse> responses = mappings.stream().map(m -> {
            MachineAttributes attr = m.getAttribute();
            MachineAttributeResponse response = new MachineAttributeResponse();
            response.setId(attr.getId());
            response.setName(attr.getName());
            response.setUnit(attr.getUnit());
            response.setInputType(attr.getInputType());

            if ("select".equalsIgnoreCase(attr.getInputType())) {
                List<MachineAttributeOption> options = machineAttributeOptionRepo.findByAttribute(attr);
                response.setOptions(options.stream().map(MachineAttributeOption::getValue).toList());
            }

            return response;
        }).toList();

        if (mappings.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "status", HttpStatus.NOT_FOUND.value(),
                            "error", "Немає атрибутів для типу: " + type
                    ));
        }

        return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                "status", HttpStatus.OK.value(),
                "message", "Successfully",
                "data", responses));
    }
}
