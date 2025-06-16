package com.example.demo.dto.mail;

public record EmailSupplierRequest(String to, String subject, String replyTo, String dataHtml) {
}
