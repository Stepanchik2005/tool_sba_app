package com.example.demo;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data

public class OperationResult<T> {
    private boolean success;
    private String message;
    private T data;

    public OperationResult(boolean success, String message, T data)
    {
        this.success = success;
        this.message = message;
        this.data = data;
    }
    public OperationResult(boolean success, String message)
    {
        this.success = success;
        this.message = message;
    }
}
