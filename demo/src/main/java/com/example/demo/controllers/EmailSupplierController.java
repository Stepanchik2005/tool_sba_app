package com.example.demo.controllers;

import com.example.demo.dto.mail.EmailSupplierRequest;
import com.example.demo.services.EmailSupplierService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
public class EmailSupplierController {
    private final EmailSupplierService emailService;

    @PostMapping("/send")
    public ResponseEntity<?> sendEmail(@RequestBody EmailSupplierRequest request)
    {
       try{
           emailService.sendEmail(request.to(), request.subject(), request.replyTo(), request.dataHtml());
       } catch (Exception ex){throw new RuntimeException(ex.getMessage());}

       return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "Successfully sent"));
    }
}
