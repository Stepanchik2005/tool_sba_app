package com.example.demo.dto.set;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class ToolHolderResponse extends SetObjectResponse
{
    public ToolHolderResponse(){}
    public ToolHolderResponse(Long id, String name, String marking, String articleNumber, String link,
                              String supplierName, String brandName)
    {
        super(id, name, marking, articleNumber, link, supplierName, brandName);
    }
    public ToolHolderResponse(Long id, String name, String marking, String articleNumber, String link,
                              String supplierName, String brandName, WebsiteData websiteData)
    {
        super(id, name, marking, articleNumber, link, supplierName, brandName, websiteData);
    }
}
