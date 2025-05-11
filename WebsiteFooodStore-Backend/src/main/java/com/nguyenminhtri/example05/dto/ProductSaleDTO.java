package com.nguyenminhtri.example05.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSaleDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private Double originalPrice;
    private Double discount;
    private Double salePrice;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private boolean active;
} 