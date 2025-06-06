package com.example.demo.dto.set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor

public class WebsiteData {
    private String price;
    private Boolean isAvailable;
}
