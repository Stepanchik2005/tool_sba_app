package com.example.demo.dto.set;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class InstrumentResponse extends SetObjectResponse
{
    public InstrumentResponse(){}
    public InstrumentResponse(Long id, String name, String marking, String articleNumber, String link,
                              String instrumentMaterial, String supplierName, String brandName, String materialBrand,
                              WebsiteData websiteData)
    {
        super(id, name, marking, articleNumber, link, supplierName, brandName, websiteData);
        this.materialBrand = materialBrand;
        this.instrumentMaterial = instrumentMaterial;
    }
    public InstrumentResponse(Long id, String name, String marking, String articleNumber, String link,
                              String instrumentMaterial, String supplierName, String brandName, String materialBrand)
    {
        super(id, name, marking, articleNumber, link, supplierName, brandName);
        this.materialBrand = materialBrand;
        this.instrumentMaterial = instrumentMaterial;
    }

    private String materialBrand;
    private String instrumentMaterial;

}
