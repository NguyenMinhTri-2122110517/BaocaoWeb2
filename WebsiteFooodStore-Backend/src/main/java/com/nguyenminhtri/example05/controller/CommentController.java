package com.nguyenminhtri.example05.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.nguyenminhtri.example05.dto.CommentDTO;
import com.nguyenminhtri.example05.service.CommentService;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;

    // Request chỉ cần content
    public static class CommentRequest {
        private String content;
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    @PostMapping("/post/{userId}/{postId}")
    public CommentDTO addComment(
            @PathVariable Long userId,
            @PathVariable Long postId,
            @RequestBody CommentRequest request) {
        return commentService.addComment(postId, userId, request.getContent());
    }

    @GetMapping("/post/{postId}")
    public List<CommentDTO> getCommentsByPost(@PathVariable Long postId) {
        return commentService.getCommentsByPostId(postId);
    }
} 