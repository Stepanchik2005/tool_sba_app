package com.example.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendRedirectController {

    @RequestMapping(value = {
            "/", "/select-enterprise", "/material-form", "/dashboard", "/register"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
