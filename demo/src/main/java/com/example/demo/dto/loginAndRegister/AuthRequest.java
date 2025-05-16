package com.example.demo.dto.loginAndRegister;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
