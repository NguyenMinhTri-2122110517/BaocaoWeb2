package com.nguyenminhtri.example05.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.nguyenminhtri.example05.dto.PostDTO;
import com.nguyenminhtri.example05.service.PostService;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.io.FileNotFoundException;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping("/posts/user/{userId}")
    public ResponseEntity<PostDTO> createPost(
            @RequestBody PostDTO postDTO,
            @PathVariable Long userId) {
        PostDTO createdPost = postService.createPost(postDTO, userId);
        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    }

    @GetMapping("/posts")
    public ResponseEntity<List<PostDTO>> getAllPosts() {
        List<PostDTO> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable Long id) {
        PostDTO post = postService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/users/{userId}/posts")
    public ResponseEntity<List<PostDTO>> getPostsByUser(@PathVariable Long userId) {
        List<PostDTO> posts = postService.getPostsByUser(userId);
        return ResponseEntity.ok(posts);
    }

    @PutMapping("/posts/{id}")
    public ResponseEntity<PostDTO> updatePost(
            @PathVariable Long id,
            @RequestBody PostDTO postDTO) {
        PostDTO updatedPost = postService.updatePost(id, postDTO);
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/posts/{postId}/image")
    public ResponseEntity<PostDTO> updatePostImage(
            @PathVariable Long postId,
            @RequestParam("image") MultipartFile image) throws IOException {
        PostDTO updatedPost = postService.updatePostImage(postId, image);
        return ResponseEntity.ok(updatedPost);
    }

    @PutMapping("/admin/posts/{postId}/approve")
    public ResponseEntity<PostDTO> approvePost(@PathVariable Long postId) {
        PostDTO approvedPost = postService.approvePost(postId);
        return ResponseEntity.ok(approvedPost);
    }

    @GetMapping("/admin/posts/pending")
    public ResponseEntity<List<PostDTO>> getPendingPosts() {
        List<PostDTO> posts = postService.getPendingPosts();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/admin/posts/approved")
    public ResponseEntity<List<PostDTO>> getApprovedPosts() {
        List<PostDTO> posts = postService.getApprovedPosts();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/public/posts/image/{fileName}")
    public ResponseEntity<InputStreamResource> getPostImage(@PathVariable String fileName) throws FileNotFoundException {
        InputStream imageStream = postService.getPostImage(fileName);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentDispositionFormData("inline", fileName);
        return new ResponseEntity<>(new InputStreamResource(imageStream), headers, HttpStatus.OK);
    }

    @PostMapping("/users/{userId}/posts/{postId}/like")
    public ResponseEntity<PostDTO> likePost(
            @PathVariable Long userId,
            @PathVariable Long postId) {
        PostDTO likedPost = postService.likePost(postId, userId);
        return ResponseEntity.ok(likedPost);
    }

    @DeleteMapping("/users/{userId}/posts/{postId}/like")
    public ResponseEntity<PostDTO> unlikePost(
            @PathVariable Long userId,
            @PathVariable Long postId) {
        PostDTO unlikedPost = postService.unlikePost(postId, userId);
        return ResponseEntity.ok(unlikedPost);
    }
}