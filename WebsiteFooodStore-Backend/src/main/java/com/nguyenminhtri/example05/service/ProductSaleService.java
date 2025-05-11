package com.nguyenminhtri.example05.service;

import java.util.List;

import com.nguyenminhtri.example05.dto.ProductSaleDTO;

public interface ProductSaleService {
    List<ProductSaleDTO> getAllProductSales();
    ProductSaleDTO getProductSaleById(Long id);
    ProductSaleDTO createProductSale(ProductSaleDTO productSaleDTO);
    ProductSaleDTO updateProductSale(Long id, ProductSaleDTO productSaleDTO);
    void deleteProductSale(Long id);
} 