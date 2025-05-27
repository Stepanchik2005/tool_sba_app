package com.example.demo.dto;


import lombok.Data;
import java.util.List;
@Data
public class ProcessingTypeAttributeValuesRequest {
    private Long processingTypeId;
    private Long detailId;
    private Long coolingTypeId;
    private Long coolingMethodId;
    private List<AttributeValueItem> values;

    @Data
    public static class AttributeValueItem {
        private Long attributeId;
        private String value;
    }
}
