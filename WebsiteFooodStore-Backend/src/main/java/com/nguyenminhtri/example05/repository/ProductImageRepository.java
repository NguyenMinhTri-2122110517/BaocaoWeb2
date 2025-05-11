package com.nguyenminhtri.example05.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.nguyenminhtri.example05.entity.ProductImage;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    @Query("SELECT pi FROM ProductImage pi WHERE pi.product.productId = :productId")
    Optional<ProductImage> findByProductId(Long productId);
} 