package com.example.demo.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service

public class EmailSupplierService {

    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromAddress;

    public EmailSupplierService(JavaMailSender mailSender)
    {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String replyTo, String htmlData)
    {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String finalSubject = (subject == null || subject.isBlank()) ? "No Subject" : subject;
            helper.setSubject(finalSubject);
            helper.setFrom(fromAddress);
            helper.setText(htmlData, true);
            helper.setTo(to);
            helper.setReplyTo(replyTo);

            mailSender.send(message);
        }
        catch (MessagingException ex)
        {
            throw new RuntimeException(ex.getMessage());
        }

    }
}
