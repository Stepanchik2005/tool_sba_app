package com.example.demo.dto.details;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DetailResponse {
    private Long id;
    private String name;
    private String number;
    private String orderNumber;
    private String shape;
}
