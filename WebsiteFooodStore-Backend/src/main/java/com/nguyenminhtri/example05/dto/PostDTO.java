package com.nguyenminhtri.example05.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDTO {
    private Long id;
    private String content;
    private Long userId;
    private String userName;
    private String userImage;
    private String image;
    private Integer status;
    private Integer likeCount;
    private boolean isLikedByCurrentUser;
    private boolean hasLiked;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 