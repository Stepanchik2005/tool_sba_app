package com.example.demo.dto.mail;


public record EmailVerificationRequest(String email, Long senderId) {
}
