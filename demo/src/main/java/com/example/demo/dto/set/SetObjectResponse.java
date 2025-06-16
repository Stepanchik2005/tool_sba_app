package com.example.demo.dto.set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class SetObjectResponse {
    private Long id;
    private String name;
    private String marking;
    private String articleNumber;
    private String link;
    private SupplierResponse supplier;
    private String brandName;
    private WebsiteData websiteData;


    public SetObjectResponse(Long id, String name, String marking, String articleNumber,  String link,
                             SupplierResponse supplier, String brandName)
    {
        this.id = id;
        this.name = name;
        this.marking = marking;
        this.articleNumber = articleNumber;
        this.link = link;
        this.supplier = supplier;
        this.brandName = brandName;
    }

}
