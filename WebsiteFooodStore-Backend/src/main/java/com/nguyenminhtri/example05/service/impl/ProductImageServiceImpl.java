package com.nguyenminhtri.example05.service.impl;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nguyenminhtri.example05.dto.ProductImageDTO;
import com.nguyenminhtri.example05.entity.Product;
import com.nguyenminhtri.example05.entity.ProductImage;
import com.nguyenminhtri.example05.exceptions.ResourceNotFoundException;
import com.nguyenminhtri.example05.repository.ProductImageRepo;
import com.nguyenminhtri.example05.repository.ProductRepo;
import com.nguyenminhtri.example05.service.ProductImageService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductImageServiceImpl implements ProductImageService {

    @Autowired
    private ProductImageRepo productImageRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public ProductImageDTO createProductImage(Long productId, ProductImageDTO productImageDTO) {
        Product product = productRepo.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        ProductImage productImage = modelMapper.map(productImageDTO, ProductImage.class);
        productImage.setProduct(product);
        
        ProductImage savedImage = productImageRepo.save(productImage);
        return modelMapper.map(savedImage, ProductImageDTO.class);
    }

    @Override
    public ProductImageDTO updateProductImage(Long id, ProductImageDTO productImageDTO) {
        ProductImage productImage = productImageRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("ProductImage", "id", id));

        productImage.setImage1(productImageDTO.getImage1());
        productImage.setImage2(productImageDTO.getImage2());
        productImage.setImage3(productImageDTO.getImage3());

        ProductImage updatedImage = productImageRepo.save(productImage);
        return modelMapper.map(updatedImage, ProductImageDTO.class);
    }

    @Override
    public void deleteProductImage(Long id) {
        ProductImage productImage = productImageRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("ProductImage", "id", id));
        productImageRepo.delete(productImage);
    }

    @Override
    public ProductImageDTO getProductImageById(Long id) {
        ProductImage productImage = productImageRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("ProductImage", "id", id));
        return modelMapper.map(productImage, ProductImageDTO.class);
    }

    @Override
    public List<ProductImageDTO> getProductImagesByProductId(Long productId) {
        List<ProductImage> images = productImageRepo.findByProductProductId(productId);
        return images.stream()
            .map(image -> modelMapper.map(image, ProductImageDTO.class))
            .collect(Collectors.toList());
    }
} 