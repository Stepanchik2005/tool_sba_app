package com.example.demo.exceptions;

public class EnterpriseNotExistsException extends RuntimeException {
    public EnterpriseNotExistsException(String message) {
        super(message);
    }
}
