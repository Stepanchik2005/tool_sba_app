package com.example.demo.Selenium.strategies;

import com.example.demo.Selenium.ProductInfo;
import com.example.demo.Selenium.SiteStrategy;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;

public class OceanStrategy implements SiteStrategy {
    @Override
    public boolean supports(String url)
    {
        return url.contains("ocean.biz.ua");
    }
    @Override
    public ProductInfo fetch(String url, String article) throws IOException {
        Document doc = Jsoup.connect(url)
                .userAgent("Mozilla/5.0")
                .timeout(50_000)
                .get();

        if(!doc.text().toLowerCase().contains(article.toLowerCase()))
        {
            String searchUrl = "https://ocean.biz.ua/index.php?route=product/search&search=" + article;

            Document searchPage = Jsoup.connect(searchUrl)
                    .userAgent("Mozilla/5.0")
                    .timeout(10_000)
                    .get();

            Element productLink = searchPage.selectFirst(".product-thumb a"); // примерный селектор
            if (productLink != null) {
                String productUrl = productLink.absUrl("href");
                doc = Jsoup.connect(productUrl)
                        .userAgent("Mozilla/5.0")
                        .timeout(10_000)
                        .get();
            } else {
                throw new RuntimeException("❌ Товар не найден по артикулу: " + article);
            }

        }

        String price = trySelectors(doc, ".price-new", ".price", ".product-price", "[itemprop=price]");

        boolean available = detectAvailability(doc);

        return new ProductInfo(price, available, article);
    }
    private boolean detectAvailability(Document doc)
    {
        Element current = doc.selectFirst("div.stock");
         if(current != null)
         {
             Element nextDiv = current.nextElementSibling();
             if (nextDiv != null) {
                 String text = nextDiv.text();
                 boolean availiable = isAvailiableFromText(text);
                 return availiable;
             }
         }
//        Elements elements = doc.select("div, span, p, td, li");
//
//        for(Element el : elements)
//        {
//            String text = el.text().toLowerCase().trim();
//
//            if (text.contains("наличие") || text.contains("в наличии") || text.contains("шт") ||
//                    text.contains("немає")  || text.contains("нема") || text.contains("відсутн") ||
//                    text.contains("есть") || text.contains("нет") || text.contains("на складе") ||
//                    text.contains("є") || text.contains("наявність") || text.contains("в наявності"))
//            {
//
//                boolean availiable = isAvailiableFromText(text);
//                return availiable;
//            }
//        }

        return false;
    }

    private boolean isAvailiableFromText(String text)
    {
        if(text == null || text.isBlank()) return false;


        text = text.toLowerCase().trim();

//        if (text.contains("нет") || text.contains("отсутствует") || text.contains("немає")) {return false;}
//        if (text.contains("в наличии") || text.contains("есть") || text.contains("на складе")
//                || text.contains("в наясності") || text.contains("є") || text.contains("на складі")) {return true;}

        String digits = text.replaceAll("\\D+", "");

        if (!digits.isEmpty()) {
            try {
                int qty = Integer.parseInt(digits);
                return qty > 0;
            } catch (NumberFormatException ignored) {}
        }

        return false;
    }

    private String trySelectors(Document doc, String... selectors) {
        for (String selector : selectors) {
            Element el = doc.selectFirst(selector);
            if (el != null && !el.text().isBlank()) {
                return el.text().trim();
            }
        }
        return "Н/Д";
    }

}
