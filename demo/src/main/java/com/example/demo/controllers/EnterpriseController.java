package com.example.demo.controllers;

import com.example.demo.dto.EnterpriseRequest;
import com.example.demo.dto.EnterpriseResponse;
import com.example.demo.models.Enterprise;
import com.example.demo.models.User;
import com.example.demo.repositories.EnterpriseRepository;
import com.example.demo.repositories.UserRepository;
import com.example.demo.services.EnterpriseService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/enterprise")
@AllArgsConstructor
public class EnterpriseController {

    private final EnterpriseService enterpriseService;
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody EnterpriseRequest request)
    {
        EnterpriseResponse response = enterpriseService.createEnterprise(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("status", HttpStatus.CREATED.value(),
                            "message", "Enterprise was successfully created",
                            "data", response));
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllEnterprises()
    {
            List<EnterpriseResponse> responseList = enterpriseService.getAllEnterprises();

        return ResponseEntity.status(HttpStatus.OK).body(responseList);
    }
}
