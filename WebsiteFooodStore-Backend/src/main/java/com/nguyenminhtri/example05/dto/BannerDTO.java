package com.nguyenminhtri.example05.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BannerDTO {
    private Long id;
    private String name;
    private String image;
    private boolean active;
} 