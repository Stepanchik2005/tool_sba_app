package com.example.demo.services;

import com.example.demo.models.EmailVerificationCode;
import com.example.demo.repositories.EmailVerificationCodeRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@AllArgsConstructor
public class EmailVerificationService {
    private final JavaMailSender mailSender;
    private final EmailVerificationCodeRepository codeRepo;

    public void sendVerificationCode(String email) throws MessagingException {
        String code = generateCode();

        EmailVerificationCode entity = new EmailVerificationCode();
        entity.setCode(code);
        entity.setEmail(email);
        entity.setCreatedAt(LocalDateTime.now());

        codeRepo.save(entity);
        //Отправка письма
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(email);
        helper.setSubject("Підтвердження Email");
        helper.setText("<p>Ваш код підтвердження: <b>" + code + "</b></p>", true);
        helper.setFrom("toolsba.sender@gmail.com"); // ← должен совпадать с username
        mailSender.send(message);

    }
    public boolean verifyCode(String email, String code)
    {
        Optional<EmailVerificationCode> entityOpt = codeRepo.findByEmailAndCode(email, code);

        if(entityOpt.isPresent())
        {
            EmailVerificationCode entity = entityOpt.get();

            if(entity.getCreatedAt().isBefore(LocalDateTime.now().minusMinutes(10))){
                return false;
            }

            codeRepo.delete(entity);
            return true;
        }

        return false;
    }
    private String generateCode()
    {
       return String.valueOf(new Random().nextInt(900000) + 100000);
    }
}
