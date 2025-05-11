package com.nguyenminhtri.example05.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageDTO {
    private Long id;
    private String image1;
    private String image2;
    private String image3;
    private Long productId;
} 