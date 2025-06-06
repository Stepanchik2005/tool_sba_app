package com.example.demo;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);

//        SeleniumFallbackStrategy strategy = new SeleniumFallbackStrategy();
//
//        try {
//            strategy.fetch("https://gefestplus.com", "000320");
//        }
//        catch (Exception e)
//        {
//           System.out.println(e.getMessage());
//        }
    }

}
