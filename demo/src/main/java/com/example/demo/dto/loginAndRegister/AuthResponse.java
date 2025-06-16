package com.example.demo.dto.loginAndRegister;
import lombok.Data;

public record AuthResponse(Long id, String username,String email, String fullName, String role, String token) {

}
