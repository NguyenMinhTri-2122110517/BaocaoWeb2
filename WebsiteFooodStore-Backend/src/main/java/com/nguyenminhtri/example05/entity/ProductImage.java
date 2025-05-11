package com.nguyenminhtri.example05.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private String image1;
    
    @Column(nullable = true)
    private String image2;
    
    @Column(nullable = true)
    private String image3;

    @OneToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}
