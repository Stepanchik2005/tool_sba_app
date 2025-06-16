package com.example.demo.dto.loginAndRegister;

public record RegisterResponse(Long id, String username,String email, String fullName, String role,
                               String token) {
}
