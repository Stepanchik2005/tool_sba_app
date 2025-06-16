package com.example.demo.dto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {
    private String fullName;
    private String email;
    private String enterpriseName;
    private String mobile;
}
