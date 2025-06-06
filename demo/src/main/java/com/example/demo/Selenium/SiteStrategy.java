package com.example.demo.Selenium;

public interface SiteStrategy {
    boolean supports(String url);
    ProductInfo fetch(String url, String article) throws Exception;
}
