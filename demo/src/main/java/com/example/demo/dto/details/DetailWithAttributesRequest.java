package com.example.demo.dto.details;
import lombok.Data;

import java.util.List;

@Data
public class DetailWithAttributesRequest {
    private String number;
    private String name;
    private String orderNumber;
    private String shape;
    private String type;
    private List<DetailAttributeValueRequest> attributes;
}
