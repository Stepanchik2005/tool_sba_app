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
@RequestMapping("/api")
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
    public ResponseEntity<Map> register(@Valid @RequestBody RegisterRequest request)
   {
       if (userRepo.existsByUsername(request.getUsername())) {
          return ResponseEntity.status(HttpStatus.CONFLICT)
                  .body(Map.of("status", HttpStatus.CONFLICT.value(),
                          "message", "Користувач вже зареєстрований"));

       }

       if (userRepo.existsByEmail(request.getEmail())) {
           return ResponseEntity.status(HttpStatus.CONFLICT)
                   .body(Map.of("status", HttpStatus.CONFLICT.value(),
                           "message", "Пошта вже зареєстрована"));
       }
       User user = new User();
       user.setEmail(request.getEmail());
       user.setPassword(passwordEncoder.encode(request.getPassword()));
       user.setRole(request.getRole());
       user.setFullName(request.getFullname());
       user.setUsername(request.getUsername());
       user.setCreatedAt(LocalDateTime.now());

       userRepo.save(user);

       return ResponseEntity.ok(Map.of("status", HttpStatus.OK.value(),
               "message", "User was registered"));
   }

   @PostMapping("/login")
    public ResponseEntity<Map> login(@RequestBody AuthRequest request)
   {
       Optional<User> optionalUser = userRepo.findByEmail(request.getEmail());

       if (optionalUser.isEmpty()) {
           return ResponseEntity.status(HttpStatus.NOT_FOUND)
                   .body(Map.of("status", HttpStatus.NOT_FOUND.value(),
                           "error", "Користувача з таким email не знайдено"));
       }
       User user = optionalUser.get();

       if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
           return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                   .body(Map.of("status", HttpStatus.UNAUTHORIZED.value(),
                           "error", "Невірний пароль"));
       }

       String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

       return ResponseEntity.status(HttpStatus.OK)
               .body(Map.of("status", HttpStatus.OK.value(),
                        "message", "Шо ты, здарова заебал",
                        "token", new AuthResponse(token).getToken()));
   }
}
