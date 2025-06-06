package com.example.demo.Selenium;

import com.example.demo.Selenium.strategies.OceanStrategy;
import com.example.demo.Selenium.strategies.UniversalFallbackStrategy;

import java.net.MalformedURLException;

import java.net.URL;
import java.util.HashMap;

import java.util.Map;

public class SiteStrategyFactory {
   // private List<SiteStrategy> strategies;
    private final Map<String, SiteStrategy> strategyMap = new HashMap<>();

    public SiteStrategyFactory() {
       SiteStrategy ocean = new OceanStrategy();
       SiteStrategy defaultStrategy = new UniversalFallbackStrategy();

       strategyMap.put("ocean.biz.ua", ocean);

       strategyMap.put("default", defaultStrategy);
    }

    public SiteStrategy resolveStrategy(String url)
    {
        try{
            String host = new URL(url).getHost();
            return strategyMap.getOrDefault(host, strategyMap.get("default"));
        }
        catch (MalformedURLException e){
            return strategyMap.get("default");
        }
    }
}
