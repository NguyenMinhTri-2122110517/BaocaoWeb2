package com.nguyenminhtri.example05.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewDTO {
    private Long id;
    private Integer rating;
    private String comment;
    private String userName;
    private String createdAt;
} 