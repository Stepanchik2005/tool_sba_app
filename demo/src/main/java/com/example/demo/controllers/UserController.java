package com.example.demo.controllers;

import com.example.demo.dto.UserResponse;
import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {
    private UserRepository userRepo;

    public UserController(UserRepository userRepo)
    {
        this.userRepo = userRepo;
    }

    @GetMapping("/user/me")
    public ResponseEntity<Map> getCurrentUser()
    {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of("status", 401, "message", "Unauthorized"));
        }

        String username = auth.getName();

        User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        UserResponse response = new UserResponse(user.getUsername(), user.getEmail(), user.getRole());

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("status", HttpStatus.OK.value(),
                "message", "Доступ успішний",
                "data", response));
    }
}
