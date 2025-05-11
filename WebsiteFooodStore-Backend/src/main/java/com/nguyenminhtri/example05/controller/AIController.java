package com.nguyenminhtri.example05.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.nguyenminhtri.example05.dto.ChatResponse;
import com.nguyenminhtri.example05.service.TogetherAIService;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private TogetherAIService togetherAIService;

    @PostMapping(value = "/chat", consumes = MediaType.TEXT_PLAIN_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> chat(@RequestBody String message) {
        try {
            String response = togetherAIService.generateResponse(message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok("Lỗi: " + e.getMessage());
        }
    }

    @GetMapping("/test")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> test() {
        try {
            String response = togetherAIService.generateResponse("Xin chào, bạn là ai?");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok("Lỗi: " + e.getMessage());
        }
    }
} 