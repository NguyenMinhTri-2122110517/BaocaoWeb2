package com.nguyenminhtri.example05.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nguyenminhtri.example05.dto.CommentDTO;
import com.nguyenminhtri.example05.entity.Comment;
import com.nguyenminhtri.example05.entity.Post;
import com.nguyenminhtri.example05.entity.User;
import com.nguyenminhtri.example05.repository.CommentRepo;
import com.nguyenminhtri.example05.repository.PostRepo;
import com.nguyenminhtri.example05.repository.UserRepo;
import com.nguyenminhtri.example05.service.CommentService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommentServiceImpl implements CommentService {
    @Autowired
    private CommentRepo commentRepo;
    @Autowired
    private PostRepo postRepo;
    @Autowired
    private UserRepo userRepo;

    private CommentDTO convertToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUserId(comment.getUser().getUserId());
        // Kết hợp firstName và lastName để tạo userName
        String userName = comment.getUser().getFirstName() + " " + comment.getUser().getLastName();
        dto.setUserName(userName);
        return dto;
    }

    @Override
    public CommentDTO addComment(Long postId, Long userId, String content) {
        Post post = postRepo.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Comment comment = new Comment();
        comment.setContent(content);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setPost(post);
        comment.setUser(user);
        Comment savedComment = commentRepo.save(comment);
        return convertToDTO(savedComment);
    }

    @Override
    public List<CommentDTO> getCommentsByPostId(Long postId) {
        Post post = postRepo.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        return commentRepo.findByPost(post).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
} 