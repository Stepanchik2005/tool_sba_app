package com.example.demo.Selenium.utils;

import java.util.List;

public class SelectorRegistry {

    public final static List<String> PRICE_SELECTORS = List.of(
            ".price-new",
            ".product-price",
            ".price",
            ".product_price",
            ".our_price_display",
            ".regular-price",
            ".special-price",
            ".price-final",
            ".price-wrapper",
            "[itemprop=price]",
            ".price-box .price",
            ".woocommerce-Price-amount",
            ".amount",
            ".current-price",
            ".product-detail-price",
            ".summary .price",
            ".price_value",
            ".main-price",
            ".final-price",
            ".prices .value",
            ".catalogue-price",
            ".total-price"
    );

    public static final List<String> AVAILABILITY_KEYWORDS = List.of(
            // Украинские
            "в наяв", "є", "є в наявності", "в наявності", "на складі", "є на складі",

            // Русские
            "в наличии", "есть в наличии", "на складе", "есть", "в наличие",

            // Английские
            "in stock", "available", "instock", "available now", "item available"
    );

    public static final List<String> AVAILABILITY_NEGATIVES = List.of(
            // Украинские
            "немає", "нема", "відсутн", "відсутній", "відсутня", "очікується", "очікування",

            // Русские
            "нет в наличии", "не в наличии", "нет", "отсутствует", "ожидается", "ожидание", "нет на складе",

            // Английские
            "out of stock", "not in stock", "not available", "unavailable", "expected soon", "coming soon", "no stock"
    );
    List<String> productLinkSelectors = List.of(
            ".product-thumb a",               // OpenCart, Bootstrap
            ".product a",                     // Обобщённый
            ".product-list a",                // Часто в результатах поиска
            ".product-title a",              // WordPress/WooCommerce
            ".products .item a",             // Magento / PrestaShop
            ".catalog-item a",               // Битрикс / Custom шаблоны
            ".item-title a",                 // Общие шаблоны
            ".product-image a",              // Shopify / Custom
            ".product-box a",                // Generic
            ".product-container a",          // Иногда в Presta
            ".woocommerce-loop-product__link", // WooCommerce
            ".card-title a",                 // Bootstrap Card View
            ".product-card a",               // Маркетплейсы / React
            ".product_wrapper a",           // Разметка на Grid
            "a[href*='/product']",           // Ссылки содержащие /product
            "a[href*='product_id=']",        // ID-продукта в URL
            "a[href*='catalog']",            // fallback
            "a[href*='item']",               // fallback
            "a[href*='sku']",                // fallback
            "a[href*='shop']"                // fallback
    );


    private SelectorRegistry() {
        // запрещаем создание экземпляра
    }
}
