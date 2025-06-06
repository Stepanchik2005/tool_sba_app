package com.example.demo.dto.set;

import lombok.Data;

@Data
public class ToolAdapterResponse extends SetObjectResponse
{
    public ToolAdapterResponse(){};
    public ToolAdapterResponse(Long id, String name, String marking, String articleNumber, String link,
                               String supplierName, String brandName)
    {
        super(id, name, marking, articleNumber, link, supplierName, brandName);
    }

    public ToolAdapterResponse(Long id, String name, String marking, String articleNumber, String link,
                               String supplierName, String brandName, WebsiteData websiteData)
    {
        super(id, name, marking, articleNumber, link, supplierName, brandName, websiteData);
    }
}

