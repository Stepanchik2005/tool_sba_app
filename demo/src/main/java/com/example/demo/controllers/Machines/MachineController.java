package com.example.demo.controllers.Machines;


import com.example.demo.dto.detail.DetailHistoryDTO;
import com.example.demo.dto.detail.ShapeTypeRequest;
import com.example.demo.dto.machine.MachineAttributeValuesRequest;
import com.example.demo.dto.machine.MachineHistoryDTO;
import com.example.demo.dto.machine.MachineTypeAttributesRequest;
import com.example.demo.dto.machine.MachineWithAttributesRequest;
import com.example.demo.models.Details.Detail;
import com.example.demo.models.Details.ShapeTypeMapping;
import com.example.demo.models.Machine.Machine;
import com.example.demo.models.Machine.MachineAttributeValues;
import com.example.demo.models.Machine.MachineAttributes;
import com.example.demo.models.User;
import com.example.demo.repositories.Details.DetailAttributeValuesRepository;
import com.example.demo.repositories.Machines.MachineAttributeValuesRepository;
import com.example.demo.repositories.Machines.MachineAttributesRepository;
import com.example.demo.repositories.Machines.MachineRepository;
import com.example.demo.repositories.Machines.MachineTypeAttributeMappingRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/machines")
public class MachineController {

    private final UserRepository userRepo;
    private final MachineAttributesRepository machineAttributesRepo;
    private final MachineRepository machineRepo;
    private final MachineAttributeValuesRepository machineAttributeValuesRepo;
    private final MachineTypeAttributeMappingRepository machineTypeAttributeMappingRepo;

    public MachineController(UserRepository userRepo, MachineAttributesRepository machineAttributesRepo,
                             MachineRepository machineRepo, MachineAttributeValuesRepository machineAttributeValuesRepo,
                             MachineTypeAttributeMappingRepository machineTypeAttributeMappingRepo){
        this.userRepo = userRepo;
        this.machineAttributesRepo = machineAttributesRepo;
        this.machineRepo = machineRepo;
        this.machineAttributeValuesRepo = machineAttributeValuesRepo;
        this.machineTypeAttributeMappingRepo = machineTypeAttributeMappingRepo;
    };

    @PostMapping("/create")
    public ResponseEntity<?> createMachine(@RequestBody MachineWithAttributesRequest request, Authentication authentication)
    {
        String username = authentication.getName();

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("📦 Received: " + request);
        request.getAttributes().forEach(a ->
                System.out.println("🧩 ID: " + a.getAttributeId() + ", val: " + a.getValue())
        );

        Machine machine = new Machine();
        machine.setInventoryNumber(request.getInventoryNumber());
        machine.setWorkshopNumber(request.getWorkshopNumber());
        machine.setModel(request.getModel());
        machine.setType(request.getType());
        machine.setChpkSystem(request.getChpkSystem());
        machine.setUser(user);

        Machine savedMachine = machineRepo.save(machine);

        for(MachineAttributeValuesRequest attr : request.getAttributes())
        {
            MachineAttributes attribute = machineAttributesRepo.findById(attr.getAttributeId()).orElseThrow(() -> new RuntimeException("Attribute not found"));

            MachineAttributeValues values = new MachineAttributeValues();
            values.setMachine(savedMachine);
            values.setAttribute(attribute);
            values.setUser(user);
            values.setValue(attr.getValue());

            machineAttributeValuesRepo.save(values);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "status", HttpStatus.CREATED.value(),
                "message", "Станки и значения аттрибутов успешно сохранены",
                "detailId", savedMachine.getId()
        ));


    }

    @GetMapping("/types")
    public ResponseEntity<?> getAllTypes() {
        List<String> types = machineTypeAttributeMappingRepo.findDistinctTypes();
        if(!types.isEmpty())
        {
            return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                    "status", HttpStatus.OK.value(),
                    "message", "Successful",
                    "data", types
            ));
        }
       else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "status", HttpStatus.NOT_FOUND.value(),
                    "error", "There are no types in db"
            ));
        }
    }
    @GetMapping("/history")
    public ResponseEntity<?> getMyMachines(Authentication auth)
    {
        User user = userRepo.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<MachineAttributeValues> values = machineAttributeValuesRepo.findAllWithFullData(user.getId());

        Map<Machine, List<MachineAttributeValues>> map = values.stream().collect(Collectors.groupingBy(MachineAttributeValues::getMachine));

        List<MachineHistoryDTO> result = map.entrySet().stream().map(entry -> {
                    Machine machine = entry.getKey();

                    List<MachineHistoryDTO.MachineAttributesDTO> attrs = entry.getValue().stream()
                            .map(v -> new MachineHistoryDTO.MachineAttributesDTO(
                                    v.getAttribute().getName(),
                                    v.getAttribute().getUnit(),
                                    v.getValue()
                            ))
                            .toList();
                    return new MachineHistoryDTO(
                            machine.getId(),
                            machine.getInventoryNumber(),
                            machine.getWorkshopNumber(),
                            machine.getType(),
                            machine.getModel(),
                            machine.getChpkSystem(),
                            attrs
                    );
                }
                ).toList();

        return ResponseEntity.ok(Map.of(
                "status", 200,
                "message", "Деталі з історії успішно завантажено",
                "data", result
        ));
    }

}
