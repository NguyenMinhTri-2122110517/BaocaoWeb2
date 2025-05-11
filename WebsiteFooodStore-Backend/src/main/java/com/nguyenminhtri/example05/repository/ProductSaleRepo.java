package com.nguyenminhtri.example05.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nguyenminhtri.example05.entity.ProductSale;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProductSaleRepo extends JpaRepository<ProductSale, Long> {
    List<ProductSale> findByActiveTrue();
    List<ProductSale> findByEndDateAfterAndActiveTrue(LocalDateTime now);
    List<ProductSale> findByProductProductId(Long id);
} 