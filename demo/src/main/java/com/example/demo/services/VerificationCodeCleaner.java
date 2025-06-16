package com.example.demo.services;

import com.example.demo.models.EmailVerificationCode;
import com.example.demo.repositories.EmailVerificationCodeRepository;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Component
@AllArgsConstructor
public class VerificationCodeCleaner {
    private EmailVerificationCodeRepository codeRepository;

    @Scheduled(fixedRate = 10, timeUnit = TimeUnit.MINUTES)
    public void cleanOldCode()
    {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(10);
        codeRepository.deleteAllByCreatedAtBefore(cutoff);
    }
}
