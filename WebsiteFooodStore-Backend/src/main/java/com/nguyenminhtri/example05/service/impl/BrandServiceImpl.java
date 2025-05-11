package com.nguyenminhtri.example05.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nguyenminhtri.example05.entity.Brand;
import com.nguyenminhtri.example05.repository.BrandRepository;
import com.nguyenminhtri.example05.service.BrandService;

import java.util.List;

@Service
public class BrandServiceImpl implements BrandService {

    @Autowired
    private BrandRepository brandRepository;

    @Override
    public Brand saveBrand(Brand brand) {
        return brandRepository.save(brand);
    }

    @Override
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    @Override
    public Brand getBrandById(Long id) {
        return brandRepository.findById(id).orElse(null);
    }

    @Override
    public Brand updateBrand(Long id, Brand brand) {
        Brand existingBrand = brandRepository.findById(id).orElse(null);
        if (existingBrand != null) {
            existingBrand.setName(brand.getName());
            existingBrand.setDescription(brand.getDescription());
            return brandRepository.save(existingBrand);
        }
        return null;
    }

    @Override
    public void deleteBrand(Long id) {
        brandRepository.deleteById(id);
    }
} 