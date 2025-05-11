package com.nguyenminhtri.example05.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nguyenminhtri.example05.entity.Banner;

import java.util.List;

@Repository
public interface BannerRepo extends JpaRepository<Banner, Long> {
    List<Banner> findByActiveTrue();
} 