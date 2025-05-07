package com.example.demo.controllers;
import com.example.demo.dto.AuthRequest;
import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;
import com.example.demo.security.JwtUtil;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepo,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }
   @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request)
   {
       if (userRepo.existsByUsername(request.getUsername())) {
           return ResponseEntity.status(HttpStatus.CONFLICT)
                   .body("Username already exists");
       }

       if (userRepo.existsByEmail(request.getEmail())) {
           return ResponseEntity.status(HttpStatus.CONFLICT)
                   .body("Email already registered");
       }
       User user = new User();
       user.setEmail(request.getEmail());
       user.setPassword(passwordEncoder.encode(request.getPassword()));
       user.setRole(request.getRole());
       user.setFullName(request.getFullname());
       user.setUsername(request.getUsername());
       user.setCreatedAt(LocalDateTime.now());

       userRepo.save(user);

       return ResponseEntity.ok("Користувач зареєстрований!");
   }

   @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request)
   {
       Optional<User> optionalUser = userRepo.findByEmail(request.getEmail());

       if (optionalUser.isEmpty()) {
           return ResponseEntity.status(HttpStatus.NOT_FOUND)
                   .body(Map.of("error", "Користувача з таким email не знайдено"));
       }
       User user = optionalUser.get();

       if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
           return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                   .body(Map.of("error", "Невірний пароль"));
       }

       String token = jwtUtil.generateToken(user.getUsername());
       return ResponseEntity.ok(new AuthResponse(token));
   }
}
