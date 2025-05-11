package com.nguyenminhtri.example05.service;

import java.util.List;

import com.nguyenminhtri.example05.dto.ReviewDTO;

public interface ReviewService {
    ReviewDTO createReview(Long productId, ReviewDTO reviewDTO, Long userId, Long orderId);
    List<ReviewDTO> getProductReviews(Long productId);
} 