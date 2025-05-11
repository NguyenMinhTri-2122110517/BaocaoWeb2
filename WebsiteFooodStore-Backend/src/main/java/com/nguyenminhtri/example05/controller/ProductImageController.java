package com.nguyenminhtri.example05.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nguyenminhtri.example05.dto.ProductImageDTO;
import com.nguyenminhtri.example05.service.ProductImageService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductImageController {

    @Autowired
    private ProductImageService productImageService;

    @PostMapping("/admin/products/{productId}/images")
    public ResponseEntity<ProductImageDTO> createProductImage(
            @PathVariable Long productId,
            @RequestBody ProductImageDTO productImageDTO) {
        ProductImageDTO createdImage = productImageService.createProductImage(productId, productImageDTO);
        return new ResponseEntity<>(createdImage, HttpStatus.CREATED);
    }

    @PutMapping("/admin/products/images/{id}")
    public ResponseEntity<ProductImageDTO> updateProductImage(
            @PathVariable Long id,
            @RequestBody ProductImageDTO productImageDTO) {
        ProductImageDTO updatedImage = productImageService.updateProductImage(id, productImageDTO);
        return new ResponseEntity<>(updatedImage, HttpStatus.OK);
    }

    @DeleteMapping("/admin/products/images/{id}")
    public ResponseEntity<Void> deleteProductImage(@PathVariable Long id) {
        productImageService.deleteProductImage(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/public/products/images/{id}")
    public ResponseEntity<ProductImageDTO> getProductImage(@PathVariable Long id) {
        ProductImageDTO productImage = productImageService.getProductImageById(id);
        return new ResponseEntity<>(productImage, HttpStatus.OK);
    }

    @GetMapping("/public/products/{productId}/images")
    public ResponseEntity<List<ProductImageDTO>> getProductImages(@PathVariable Long productId) {
        List<ProductImageDTO> productImages = productImageService.getProductImagesByProductId(productId);
        return new ResponseEntity<>(productImages, HttpStatus.OK);
    }
} 