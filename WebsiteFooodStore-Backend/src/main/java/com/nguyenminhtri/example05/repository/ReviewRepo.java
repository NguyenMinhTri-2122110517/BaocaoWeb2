package com.nguyenminhtri.example05.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nguyenminhtri.example05.entity.Review;

import java.util.List;

public interface ReviewRepo extends JpaRepository<Review, Long> {
    List<Review> findByProduct_ProductId(Long productId);
} 