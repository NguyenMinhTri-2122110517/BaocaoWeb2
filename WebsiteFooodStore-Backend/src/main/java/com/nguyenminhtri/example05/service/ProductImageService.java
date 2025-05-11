package com.nguyenminhtri.example05.service;

import java.util.List;

import com.nguyenminhtri.example05.dto.ProductImageDTO;

public interface ProductImageService {
    ProductImageDTO createProductImage(Long productId, ProductImageDTO productImageDTO);
    ProductImageDTO updateProductImage(Long id, ProductImageDTO productImageDTO);
    void deleteProductImage(Long id);
    ProductImageDTO getProductImageById(Long id);
    List<ProductImageDTO> getProductImagesByProductId(Long productId);
} 