package com.nguyenminhtri.example05.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nguyenminhtri.example05.dto.ProductSaleDTO;
import com.nguyenminhtri.example05.entity.Product;
import com.nguyenminhtri.example05.entity.ProductSale;
import com.nguyenminhtri.example05.exceptions.ResourceNotFoundException;
import com.nguyenminhtri.example05.repository.ProductRepo;
import com.nguyenminhtri.example05.repository.ProductSaleRepo;
import com.nguyenminhtri.example05.service.ProductSaleService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductSaleServiceImpl implements ProductSaleService {

    @Autowired
    private ProductSaleRepo productSaleRepo;

    @Autowired
    private ProductRepo productRepo;

    @Override
    public ProductSaleDTO createProductSale(ProductSaleDTO productSaleDTO) {
        Product product = productRepo.findById(productSaleDTO.getProductId())
            .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productSaleDTO.getProductId()));

        ProductSale productSale = new ProductSale();
        productSale.setProduct(product);
        productSale.setDiscount(productSaleDTO.getDiscount());
        productSale.setStartDate(productSaleDTO.getStartDate());
        productSale.setEndDate(productSaleDTO.getEndDate());
        productSale.setActive(productSaleDTO.isActive());

        ProductSale savedProductSale = productSaleRepo.save(productSale);
        return mapToDTO(savedProductSale);
    }

    @Override
    public ProductSaleDTO updateProductSale(Long id, ProductSaleDTO productSaleDTO) {
        ProductSale productSale = productSaleRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("ProductSale", "id", id));

        if (productSaleDTO.getProductId() != null) {
            Product product = productRepo.findById(productSaleDTO.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productSaleDTO.getProductId()));
            productSale.setProduct(product);
        }

        productSale.setDiscount(productSaleDTO.getDiscount());
        productSale.setStartDate(productSaleDTO.getStartDate());
        productSale.setEndDate(productSaleDTO.getEndDate());
        productSale.setActive(productSaleDTO.isActive());

        ProductSale updatedProductSale = productSaleRepo.save(productSale);
        return mapToDTO(updatedProductSale);
    }

    @Override
    public void deleteProductSale(Long id) {
        ProductSale productSale = productSaleRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("ProductSale", "id", id));
        productSaleRepo.delete(productSale);
    }

    @Override
    public List<ProductSaleDTO> getAllProductSales() {
        List<ProductSale> productSales = productSaleRepo.findAll();
        return productSales.stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    @Override
    public ProductSaleDTO getProductSaleById(Long id) {
        ProductSale productSale = productSaleRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("ProductSale", "id", id));
        return mapToDTO(productSale);
    }

    private ProductSaleDTO mapToDTO(ProductSale productSale) {
        Product product = productSale.getProduct();
        ProductSaleDTO dto = new ProductSaleDTO();
        
        dto.setId(productSale.getId());
        dto.setProductId(product.getProductId());
        dto.setProductName(product.getProductName());
        dto.setProductImage(product.getImage());
        dto.setOriginalPrice(product.getPrice());
        dto.setDiscount(productSale.getDiscount());
        
        // Calculate sale price
        double salePrice = product.getPrice() * (1 - productSale.getDiscount() / 100.0);
        dto.setSalePrice(salePrice);
        
        dto.setStartDate(productSale.getStartDate());
        dto.setEndDate(productSale.getEndDate());
        dto.setActive(productSale.isActive());
        
        return dto;
    }
} 