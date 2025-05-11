package com.nguyenminhtri.example05.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nguyenminhtri.example05.dto.ReviewDTO;
import com.nguyenminhtri.example05.service.OrderService;
import com.nguyenminhtri.example05.service.ReviewService;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;
    
    @Autowired
    private OrderService orderService;
    
    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<List<ReviewDTO>> getProductReviews(@PathVariable Long productId) {
        List<ReviewDTO> reviews = reviewService.getProductReviews(productId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }
    
    @PostMapping("/orders/{orderId}/products/{productId}/review")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewDTO> addReview(
            @PathVariable Long orderId,
            @PathVariable Long productId,
            @RequestBody ReviewDTO reviewDTO,
            @RequestParam Long userId) {
        try {
            ReviewDTO savedReview = reviewService.createReview(productId, reviewDTO, userId, orderId);
            return new ResponseEntity<>(savedReview, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            throw new RuntimeException(e.getMessage());
        }
    }
} 