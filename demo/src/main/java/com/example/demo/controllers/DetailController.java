package com.example.demo.controllers;


import com.example.demo.dto.DetailRequest;

import com.example.demo.dto.DetailResponse;
import com.example.demo.models.Detail;
import com.example.demo.models.User;
import com.example.demo.repositories.DetailRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController

public class DetailController {

    private final DetailRepository detailRepo;
    private final UserRepository userRepo;

    public DetailController(DetailRepository detailRepo, UserRepository userRepo)
    {
        this.detailRepo = detailRepo;
        this.userRepo = userRepo;
    }

    @PostMapping("/details")
    public ResponseEntity<?> createDetail(@RequestBody DetailRequest request, Authentication authentication)
    {
        String username = authentication.getName();
        User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        Detail detail = new Detail();

        detail.setName(request.getName());
        detail.setNumber(request.getNumber());
        detail.setOrderNumber(request.getOrderNumber());
        detail.setShape(request.getShape());
        detail.setUser(user);

        Detail saved = detailRepo.save(detail);

        DetailResponse response = new DetailResponse(saved.getId(),
                saved.getName(), saved.getNumber(), saved.getOrderNumber(), saved.getShape());

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "status", 201,
                "message", "Detail created",
                "data", response
        ));
    }
}
