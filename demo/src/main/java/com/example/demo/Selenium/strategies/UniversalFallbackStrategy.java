package com.example.demo.Selenium.strategies;

import com.example.demo.Selenium.ProductInfo;
import com.example.demo.Selenium.SiteStrategy;
import com.example.demo.Selenium.utils.WebDriverFactory;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class UniversalFallbackStrategy implements SiteStrategy {

    @Override
    public boolean supports(String url) {
        return true; // fallback always applies
    }

    @Override
    public ProductInfo fetch(String url, String article) {
        WebDriver driver = WebDriverFactory.create(); // можно вынести

        try {
            driver.get(url);
            WebElement searchInput = driver.findElement(
                    By.xpath("//input[contains(@name, 'search') or contains(@id, 'search') or contains(@placeholder, 'search') or contains(@placeholder, 'пошук')]")
            );

            searchInput.sendKeys(article + Keys.ENTER);

            Thread.sleep(2000); // либо WebDriverWait

           // WebElement firstProduct = findFirstProduct(driver);
            WebElement firstProduct = driver.findElement(
                    By.xpath("//a[contains(@class, 'product') or contains(@class, 'item') or contains(@class, 'catalog')]")
            );
            firstProduct.click();

            Thread.sleep(2000);

            //String price = trySelectors(driver, SelectorRegistry.PRICE_SELECTORS);
            String price = "";
            List<WebElement> xpathResults = driver.findElements(By.xpath(
                    "//*[contains(@class, 'price') or contains(@id, 'price') or contains(@name, 'price') or contains(@itemprop, 'price') or contains(@data-qaid, 'price')]"
            ));
            for (WebElement el : xpathResults) {
                String text = el.getText().trim();
                if (isValidPrice(text))
                {
                     price = text;
                     break;
                }
            }
            boolean available = detectAvailability(driver);

            return new ProductInfo(price, available, article);
        } catch (Exception e) {
            return new ProductInfo("—", false, article);
        } finally {
            driver.quit();
        }
    }

    private static boolean isValidPrice(String text) {
        return text.matches(".*\\d+.*") && text.length() <= 30; // ограничение длины — защита от мусора
    }

    private String trySelectors(WebDriver driver, List<String> selectors) {
        for (String sel : selectors) {
            List<WebElement> elements = driver.findElements(By.cssSelector(sel));
            if (!elements.isEmpty() && !elements.get(0).getText().isBlank()) {
                return elements.get(0).getText();
            }
        }
        return "—";
    }

    private boolean detectAvailability(WebDriver driver) {
        List<String> keywords = List.of(
                "в наяв", "є", "налич", "есть", "in stock", "available"
        );
        List<String> negatives = List.of(
                "немає", "нема", "відсутн", "нет в наличии", "ожидается", "out of stock", "not available"
        );

        try {
            String pageText = driver.getPageSource().toLowerCase();

            for (String negative : negatives) {
                if (pageText.contains(negative)) return false;
            }

            for (String keyword : keywords) {
                if (pageText.contains(keyword)) return true;
            }

        } catch (Exception e) {
            return false;
        }

        return false; // если ничего не нашли — считаем что нет
    }

//    private WebElement findFirstProduct(WebDriver driver)
//    {
//        for(String selector : SelectorRegistry.PRICE_SELECTORS)
//        {
//            List<WebElement> elements = driver.findElements(By.cssSelector(selector));
//            if (!elements.isEmpty()) {
//                return elements.get(0);
//            }
//        }
//        throw new NoSuchElementException("Product link not found");
//    }
}

