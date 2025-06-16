package com.example.demo.dto.set;

import lombok.Data;

@Data
public class ToolAdapterResponse extends SetObjectResponse
{
    public ToolAdapterResponse(){};
    public ToolAdapterResponse(Long id, String name, String marking, String articleNumber, String link,
                               SupplierResponse supplier, String brandName)
    {
        super(id, name, marking, articleNumber, link, supplier, brandName);
    }

    public ToolAdapterResponse(Long id, String name, String marking, String articleNumber, String link,
                               SupplierResponse supplier, String brandName, WebsiteData websiteData)
    {
        super(id, name, marking, articleNumber, link, supplier, brandName, websiteData);
    }
}

