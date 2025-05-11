package com.nguyenminhtri.example05.service;

import org.springframework.web.multipart.MultipartFile;

import com.nguyenminhtri.example05.dto.PostDTO;

import java.io.IOException;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.List;

public interface PostService {
    PostDTO createPost(PostDTO postDTO, Long userId);
    List<PostDTO> getAllPosts();
    PostDTO getPostById(Long id);
    List<PostDTO> getPostsByUser(Long userId);
    PostDTO updatePost(Long id, PostDTO postDTO);
    void deletePost(Long id);
    PostDTO updatePostImage(Long postId, MultipartFile image) throws IOException;
    PostDTO approvePost(Long postId);
    List<PostDTO> getPendingPosts();
    List<PostDTO> getApprovedPosts();
    InputStream getPostImage(String fileName) throws FileNotFoundException;
    PostDTO likePost(Long postId, Long userId);
    PostDTO unlikePost(Long postId, Long userId);
} 