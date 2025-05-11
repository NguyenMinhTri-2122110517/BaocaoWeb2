package com.nguyenminhtri.example05.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nguyenminhtri.example05.entity.Comment;
import com.nguyenminhtri.example05.entity.Post;

import java.util.List;

public interface CommentRepo extends JpaRepository<Comment, Long> {
    List<Comment> findByPost(Post post);
} 