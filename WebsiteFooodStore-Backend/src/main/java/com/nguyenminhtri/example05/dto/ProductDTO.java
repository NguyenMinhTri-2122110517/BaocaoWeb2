package com.nguyenminhtri.example05.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long productId;
    private String productName;
    private String image;
    private String image1;
    private String image2;
    private String image3;
    private String description;
    private Integer quantity;
    private Double price;
    private Double discount;
    private CategoryDTO category;
    
    // Thêm các trường mới
    private Double averageRating = 0.0;
    private Integer totalReviews = 0;
    private List<ReviewDTO> reviews;
    private List<ProductImageDTO> images;
}