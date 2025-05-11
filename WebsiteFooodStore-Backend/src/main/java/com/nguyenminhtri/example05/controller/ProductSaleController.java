package com.nguyenminhtri.example05.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nguyenminhtri.example05.dto.ProductSaleDTO;
import com.nguyenminhtri.example05.service.ProductSaleService;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ProductSaleController {

    @Autowired
    private ProductSaleService productSaleService;

    @GetMapping("/public/product-sales")
    public ResponseEntity<List<ProductSaleDTO>> getAllProductSales() {
        List<ProductSaleDTO> sales = productSaleService.getAllProductSales();
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/public/product-sales/{id}")
    public ResponseEntity<ProductSaleDTO> getProductSaleById(@PathVariable Long id) {
        ProductSaleDTO sale = productSaleService.getProductSaleById(id);
        return ResponseEntity.ok(sale);
    }

    @PostMapping("/admin/product-sales")
    public ResponseEntity<ProductSaleDTO> createProductSale(@RequestBody ProductSaleDTO productSaleDTO) {
        ProductSaleDTO createdSale = productSaleService.createProductSale(productSaleDTO);
        return new ResponseEntity<>(createdSale, HttpStatus.CREATED);
    }

    @PutMapping("/admin/product-sales/{id}")
    public ResponseEntity<ProductSaleDTO> updateProductSale(
            @PathVariable Long id,
            @RequestBody ProductSaleDTO productSaleDTO) {
        ProductSaleDTO updatedSale = productSaleService.updateProductSale(id, productSaleDTO);
        return ResponseEntity.ok(updatedSale);
    }

    @DeleteMapping("/admin/product-sales/{id}")
    public ResponseEntity<Void> deleteProductSale(@PathVariable Long id) {
        productSaleService.deleteProductSale(id);
        return ResponseEntity.noContent().build();
    }
} 