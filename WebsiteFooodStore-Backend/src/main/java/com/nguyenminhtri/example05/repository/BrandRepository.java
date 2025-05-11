package com.nguyenminhtri.example05.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nguyenminhtri.example05.entity.Brand;

public interface BrandRepository extends JpaRepository<Brand, Long> {
} 