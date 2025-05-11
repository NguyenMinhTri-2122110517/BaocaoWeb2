package com.nguyenminhtri.example05.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nguyenminhtri.example05.entity.ProductImage;

import java.util.List;

public interface ProductImageRepo extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProductProductId(Long productId);
} 