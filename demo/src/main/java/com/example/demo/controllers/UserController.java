package com.example.demo.controllers;

import com.example.demo.OperationResult;
import com.example.demo.dto.UserResponse;
import com.example.demo.dto.loginAndRegister.AuthRequest;
import com.example.demo.dto.loginAndRegister.AuthResponse;
import com.example.demo.dto.loginAndRegister.RegisterRequest;
import com.example.demo.dto.loginAndRegister.RegisterResponse;
import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;
import com.example.demo.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@AllArgsConstructor
public class UserController {
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication auth)
    {
        UserResponse response = userService.getUserInfo(auth);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request)
    {
        RegisterResponse response = userService.registerUser(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request)
    {
        AuthResponse response = userService.login(request);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @PostMapping("/set/enterprise")
    public ResponseEntity<?> setEnterpriseToUser(@RequestParam Long enterpriseId,Authentication auth)
    {
        userService.assignEnterpriseToUser(enterpriseId, auth);

        return ResponseEntity.ok(Map.of(
                "status", 200,
                "message", "Підприємство успішно прив'язано до користувача"
        ));
    }


}
