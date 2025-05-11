package com.nguyenminhtri.example05.service;

import java.util.List;

import com.nguyenminhtri.example05.entity.Brand;

public interface BrandService {
    Brand saveBrand(Brand brand);
    List<Brand> getAllBrands();
    Brand getBrandById(Long id);
    Brand updateBrand(Long id, Brand brand);
    void deleteBrand(Long id);
} 