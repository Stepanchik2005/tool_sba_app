package com.example.demo.services;

import com.example.demo.OperationResult;
import com.example.demo.dto.UserResponse;
import com.example.demo.dto.loginAndRegister.AuthRequest;
import com.example.demo.dto.loginAndRegister.AuthResponse;
import com.example.demo.dto.loginAndRegister.RegisterRequest;
import com.example.demo.dto.loginAndRegister.RegisterResponse;
import com.example.demo.exceptions.*;
import com.example.demo.models.Enterprise;
import com.example.demo.models.User;
import com.example.demo.repositories.EnterpriseRepository;
import com.example.demo.repositories.UserRepository;
import com.example.demo.security.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {
    @Autowired
    private final UserRepository userRepo;

    @Autowired
    private final EnterpriseRepository enterpriseRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public RegisterResponse registerUser(RegisterRequest request)
    {
        if (userRepo.existsByUsername(request.getUsername())) {
            throw  new UserAlreadyExistsException("Оберіть інший username");
        }

        if (userRepo.existsByEmail(request.getEmail())) {
            throw  new EmailAlreadyExistsException("Така пошта вже існує");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setFullName(request.getFullName());
        user.setUsername(request.getUsername());
        user.setCreatedAt(LocalDateTime.now());
        user.setMobile(request.getMobile());

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        User saved =  userRepo.save(user);

        RegisterResponse response = new RegisterResponse(saved.getId(), saved.getUsername(), saved.getEmail(),
                saved.getFullName(), saved.getRole(), token);

       return response;
    }

    public AuthResponse login(AuthRequest request)
    {
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("Користувача з таким email не знайдено"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new PasswordNotFoundException("Невірний пароль");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        AuthResponse response = new AuthResponse(user.getId(), user.getUsername(), user.getEmail(),
                user.getFullName(), user.getRole(), token);

        return response;
    }

    public UserResponse getUserInfo(Authentication auth)
    {
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            throw new UserUnauthorizedException("Unauthorized");
        }

        String username = auth.getName();

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        String enterpriseName = user.getEnterprise() != null ? user.getEnterprise().getName() : "Не прив’язано";

        UserResponse response = new UserResponse(user.getFullName(), user.getEmail(), enterpriseName, user.getMobile());

       return response;
    }

    public void assignEnterpriseToUser(Long enterpriseId,Authentication auth)
    {
        User user = userRepo.findByUsername(auth.getName())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Enterprise enterprise = enterpriseRepository.findById(enterpriseId)
                .orElseThrow(() -> new EnterpriseNotExistsException("Such enterprise not found"));

        user.setEnterprise(enterprise);
        userRepo.save(user); // ✅ Сохраняем изменения
    }
}
