package com.example.demo.exceptions;

public class EnterpriseAlreadyExistsException extends RuntimeException {
    public EnterpriseAlreadyExistsException(String message) {
        super(message);
    }
}
