package com.nguyenminhtri.example05.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@Controller
public class HomeController {

    @GetMapping("/")
    @ResponseBody
    public String home(HttpSession session) {
        String name = (String) session.getAttribute("name");
        if (name != null) {
            return "Welcome, " + name + "!";
        }
        return "<a href='/oauth2/authorization/google'>Login with Google</a>";
    }

    @GetMapping("/userinfo")
    @ResponseBody
    public Map<String, Object> userInfo(HttpSession session) {
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("name", session.getAttribute("name"));
        userInfo.put("email", session.getAttribute("email"));
        userInfo.put("picture", session.getAttribute("picture"));
        return userInfo;
    }
}
