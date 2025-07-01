package com.example.demo.services;

import com.example.demo.Selenium.ProductInfo;
import com.example.demo.Selenium.SiteStrategy;
import com.example.demo.Selenium.SiteStrategyFactory;
import com.example.demo.dto.set.*;
import com.example.demo.models.Set.*;
import com.example.demo.models.TechnologicalSituation;
import com.example.demo.models.TechnologicalSolution;
import com.example.demo.repositories.TechnologicalSituationRepository;
import com.example.demo.repositories.TechnologicalSolutionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
@Service
@RequiredArgsConstructor
public class SuggestedSetsService {
    private final TechnologicalSituationRepository techSitRepo;

    public WebsiteData getUserSetWebsiteData(SetObject object)
    {
        //ToolHolder holder = set.getToolHolder();
//        Instrument instrument = set.getInstrument();
//        ToolAdapter toolAdapter = (set.getToolAdapter() != null) ? set.getToolAdapter() : null;

        ProductInfo objectInfo = findPriceAndAvailability(object);
//        ProductInfo instrumentInfo = findPriceAndAvailability(instrument);
//        ProductInfo adapterInfo = toolAdapter != null ? findPriceAndAvailability(toolAdapter) : null;

      return createWebsiteData(objectInfo);
//        WebsiteData websiteInstrumentData = createWebsiteData(instrumentInfo);
//        WebsiteData websiteAdapterData = adapterInfo != null ? createWebsiteData(adapterInfo) : null;
    }
    public List<SetResponse> getSetByProcessingTypeIdAndProcessingMethodIdAndMaterialId(Long processingTypeId, Long processingMethodId,Long materialId)
    {
        Pageable top3 = PageRequest.of(0, 3);
        List<TechnologicalSituation> top3Situation = techSitRepo.findTopSituations(processingMethodId, processingTypeId, materialId, top3);
        if (top3Situation.isEmpty()) {
           throw new RuntimeException("Situations not found");
        }

        List<SetResponse> responses = top3Situation.stream().map(m -> {
            SetResponse response = toSuggestedSetRepsonse(m.getSet());
            return response;
        }).toList();

        return responses;
    }
    private <T extends SetObjectResponse> T setResponse(T response, SetObject obj, WebsiteData websiteData)
    {
        Supplier supplier = obj.getSupplier();
        SupplierResponse supplierResponse = new SupplierResponse(supplier.getId(), supplier.getEmail(),
                supplier.getName(), supplier.getMobile(), supplier.getEdpou(), supplier.getAddress());

        response.setId(obj.getId());
        response.setName(obj.getName());
        response.setMarking(obj.getMarking());
        response.setArticleNumber(obj.getArticleNumber());
        response.setLink(obj.getLink());
        response.setSupplier(supplierResponse);
        response.setBrandName(obj.getBrand().getName());
        response.setWebsiteData(websiteData);
        return response;
    }
    private WebsiteData createWebsiteData(ProductInfo info)
    {
        return new WebsiteData(info.price(),info.isAvailable());
    }
    private SetResponse toSuggestedSetRepsonse(SetEntity set)
    { //!!! ОТРЕФАКТОРИТЬ С ПЕРВЫМ МЕТОДОМ В КЛАССЕ
        ToolHolder holder = set.getToolHolder();
        Instrument instrument = set.getInstrument();
        ToolAdapter toolAdapter = (set.getToolAdapter() != null) ? set.getToolAdapter() : null;

        ProductInfo holderInfo = findPriceAndAvailability(holder);
        ProductInfo instrumentInfo = findPriceAndAvailability(instrument);
        ProductInfo adapterInfo = toolAdapter != null ? findPriceAndAvailability(toolAdapter) : null;

        ToolAdapterResponse toolAdapterResponse = null;
        WebsiteData websiteHolderData = createWebsiteData(holderInfo);
        WebsiteData websiteInstrumentData = createWebsiteData(instrumentInfo);
        WebsiteData websiteAdapterData = adapterInfo != null ? createWebsiteData(adapterInfo) : null;


        ToolHolderResponse holderResponse = setResponse(new ToolHolderResponse(), holder, websiteHolderData);
        InstrumentResponse instrumentResponse = setResponse(new InstrumentResponse(), instrument, websiteInstrumentData);
        if(toolAdapter != null && websiteAdapterData != null)
        {
            toolAdapterResponse = setResponse(new ToolAdapterResponse(), toolAdapter, websiteAdapterData);
        }

        SetResponse response = new SetResponse(
                holderResponse,
                instrumentResponse,
                toolAdapterResponse // може бути null — і це ок
        );

        return response;
    }
    private ProductInfo findPriceAndAvailability(SetObject obj) {
        SiteStrategyFactory factory = new SiteStrategyFactory();
        SiteStrategy strategy = factory.resolveStrategy(obj.getLink());
        ProductInfo holderFetch;
        try {
            holderFetch = strategy.fetch(obj.getLink(), obj.getArticleNumber());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return holderFetch;
    }
}
