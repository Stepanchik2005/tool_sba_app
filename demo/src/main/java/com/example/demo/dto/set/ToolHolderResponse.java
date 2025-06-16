package com.example.demo.dto.set;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class ToolHolderResponse extends SetObjectResponse
{
    public ToolHolderResponse(){}
    public ToolHolderResponse(Long id, String name, String marking, String articleNumber, String link,
                              SupplierResponse supplier, String brandName)
    {
        super(id, name, marking, articleNumber, link, supplier, brandName);
    }
    public ToolHolderResponse(Long id, String name, String marking, String articleNumber, String link,
                              SupplierResponse supplier, String brandName, WebsiteData websiteData)
    {
        super(id, name, marking, articleNumber, link, supplier, brandName, websiteData);
    }
}
