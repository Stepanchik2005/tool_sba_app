package com.example.demo.repositories;

import com.example.demo.models.EmailVerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface EmailVerificationCodeRepository extends JpaRepository<EmailVerificationCode, Long> {
    Optional<EmailVerificationCode> findByEmailAndCode(String email, String code);

    void deleteAllByCreatedAtBefore(LocalDateTime cutoffTime);
}
