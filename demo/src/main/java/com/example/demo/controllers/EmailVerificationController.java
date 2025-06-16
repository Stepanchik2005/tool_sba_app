package com.example.demo.controllers;

import com.example.demo.services.EmailVerificationService;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class EmailVerificationController {
    private final EmailVerificationService emailVerificationService;

    @PostMapping("/send-verification")
    public ResponseEntity<?> sendVerificationCode(@RequestBody Map<String, String> body)  {
        try{
            String email = body.get("email");
            emailVerificationService.sendVerificationCode(email);
           return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "OK"));

        } catch (MessagingException ex)
        {
            throw new RuntimeException(ex.getMessage());
        }

    }
    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> body)  {
        try{
            String email = body.get("email");
            String code = body.get("code");
            if(emailVerificationService.verifyCode(email,code)){
                return ResponseEntity.status(HttpStatus.OK)
                        .body(Map.of("status", "success",
                                "message", "Code was successfully verifying"));
            }
           else{
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("status", HttpStatus.NOT_FOUND.value(),
                                "message", "Incorrect code"));
            }

        } catch (Exception ex)
        {
            throw new RuntimeException(ex.getMessage());
        }

    }
}
