package com.example.demo.exceptions;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorResponse {
    private Integer status;
    private String error;
    private String message;

    // Конструктор без error
    public ErrorResponse(Integer status, String message) {
        this.status = status;
        this.message = message;
        this.error = null;
    }


}
