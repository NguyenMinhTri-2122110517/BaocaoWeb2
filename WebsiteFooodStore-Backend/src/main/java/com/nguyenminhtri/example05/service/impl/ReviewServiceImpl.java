package com.nguyenminhtri.example05.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nguyenminhtri.example05.dto.ReviewDTO;
import com.nguyenminhtri.example05.entity.*;
import com.nguyenminhtri.example05.exceptions.ResourceNotFoundException;
import com.nguyenminhtri.example05.repository.*;
import com.nguyenminhtri.example05.service.ReviewService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {
    @Autowired
    private ReviewRepo reviewRepo;
    
    @Autowired
    private ProductRepo productRepo;
    
    @Autowired
    private UserRepo userRepo;
    
    @Autowired
    private OrderRepo orderRepo;
    
    @Override
    public ReviewDTO createReview(Long productId, ReviewDTO reviewDTO, Long userId, Long orderId) {
        try {
            // Kiểm tra product tồn tại
            Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
                
            // Kiểm tra user tồn tại    
            User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

            // Kiểm tra order tồn tại
            Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
                
            // Validate rating
            if (reviewDTO.getRating() < 1 || reviewDTO.getRating() > 5) {
                throw new IllegalArgumentException("Rating must be between 1 and 5");
            }
                
            Review review = new Review();
            review.setRating(reviewDTO.getRating());
            review.setComment(reviewDTO.getComment());
            review.setProduct(product);
            review.setUser(user);
            review.setOrder(order);
            review.setCreatedAt(LocalDateTime.now());
            
            Review savedReview = reviewRepo.save(review);
            updateProductRating(product);
            
            return mapToDTO(savedReview);
            
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
    
    private void updateProductRating(Product product) {
        List<Review> reviews = reviewRepo.findByProduct_ProductId(product.getProductId());
        if (reviews != null && !reviews.isEmpty()) {
            double avgRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
                
            product.setAverageRating(avgRating);
            product.setTotalReviews(reviews.size());
            productRepo.save(product);
        }
    }
    
    private ReviewDTO mapToDTO(Review review) {
        if (review == null) return null;
        
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setUserName(review.getUser().getFirstName());
        dto.setCreatedAt(review.getCreatedAt().toString());
        return dto;
    }

    @Override
    public List<ReviewDTO> getProductReviews(Long productId) {
        List<Review> reviews = reviewRepo.findByProduct_ProductId(productId);
        return reviews.stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    // Add other necessary methods
} 