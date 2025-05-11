package com.nguyenminhtri.example05.service;

import java.util.List;

import com.nguyenminhtri.example05.dto.CommentDTO;
import com.nguyenminhtri.example05.entity.Comment;

public interface CommentService {
    CommentDTO addComment(Long postId, Long userId, String content);
    List<CommentDTO> getCommentsByPostId(Long postId);
} 