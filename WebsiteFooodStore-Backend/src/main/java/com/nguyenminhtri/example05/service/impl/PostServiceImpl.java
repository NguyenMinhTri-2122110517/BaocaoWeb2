package com.nguyenminhtri.example05.service.impl;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.nguyenminhtri.example05.dto.PostDTO;
import com.nguyenminhtri.example05.entity.Post;
import com.nguyenminhtri.example05.entity.User;
import com.nguyenminhtri.example05.exceptions.ResourceNotFoundException;
import com.nguyenminhtri.example05.repository.PostRepo;
import com.nguyenminhtri.example05.repository.UserRepo;
import com.nguyenminhtri.example05.service.FileService;
import com.nguyenminhtri.example05.service.PostService;

import java.io.IOException;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepo postRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private FileService fileService;

    @Value("${project.image}")
    private String path;

    @Override
    public PostDTO createPost(PostDTO postDTO, Long userId) {
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Post post = modelMapper.map(postDTO, Post.class);
        post.setUser(user);
        post.setStatus(2); // Chờ duyệt
        Post savedPost = postRepo.save(post);
        
        return mapToDTO(savedPost);
    }

    @Override
    public PostDTO updatePost(Long id, PostDTO postDTO) {
        Post post = postRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

        post.setContent(postDTO.getContent());
        Post updatedPost = postRepo.save(post);
        return mapToDTO(updatedPost);
    }

    @Override
    public void deletePost(Long id) {
        Post post = postRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));
        postRepo.delete(post);
    }

    @Override
    public PostDTO updatePostImage(Long postId, MultipartFile image) throws IOException {
        Post post = postRepo.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));
            
        String imageUrl = fileService.uploadImage(path, image);
        post.setImage(imageUrl);
        
        Post updatedPost = postRepo.save(post);
        return mapToDTO(updatedPost);
    }

    @Override
    public PostDTO approvePost(Long postId) {
        Post post = postRepo.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));
            
        post.setStatus(1); // Đã duyệt
        Post approvedPost = postRepo.save(post);
        return mapToDTO(approvedPost);
    }

    @Override
    public List<PostDTO> getPendingPosts() {
        List<Post> posts = postRepo.findByStatus(2);
        return posts.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<PostDTO> getApprovedPosts() {
        List<Post> posts = postRepo.findByStatus(1);
        return posts.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<PostDTO> getAllPosts() {
        List<Post> posts = postRepo.findByStatus(1); // Chỉ lấy bài đã duyệt
        return posts.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public PostDTO getPostById(Long id) {
        Post post = postRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));
        return mapToDTO(post);
    }

    @Override
    public List<PostDTO> getPostsByUser(Long userId) {
        List<Post> posts = postRepo.findByUserUserId(userId);
        return posts.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public InputStream getPostImage(String fileName) throws FileNotFoundException {
        return fileService.getResource(path, fileName);
    }

    @Override
    @Transactional
    public PostDTO likePost(Long postId, Long userId) {
        Post post = postRepo.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Kiểm tra xem user đã like chưa
        boolean hasLiked = postRepo.hasUserLikedPost(userId, postId);
        
        if (!hasLiked) {
            // Thêm like mới
            post.setLikeCount(post.getLikeCount() + 1);
            postRepo.save(post);
            postRepo.addLike(userId, postId);
        }

        return mapToDTO(post, userId);
    }

    @Override
    @Transactional
    public PostDTO unlikePost(Long postId, Long userId) {
        Post post = postRepo.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        // Kiểm tra xem user đã like chưa
        boolean hasLiked = postRepo.hasUserLikedPost(userId, postId);
        
        if (hasLiked) {
            // Xóa like
            post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
            postRepo.save(post);
            postRepo.removeLike(userId, postId);
        }

        return mapToDTO(post, userId);
    }

    private PostDTO mapToDTO(Post post, Long currentUserId) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setContent(post.getContent());
        dto.setImage(post.getImage());
        dto.setStatus(post.getStatus());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        dto.setLikeCount(post.getLikeCount());
        
        if (post.getUser() != null) {
            dto.setUserId(post.getUser().getUserId());
            dto.setUserName(post.getUser().getFirstName());
            dto.setUserImage(post.getUser().getPicture());
        }
        
        if (currentUserId != null) {
            dto.setLikedByCurrentUser(postRepo.hasUserLikedPost(currentUserId, post.getId()));
        } else {
            dto.setLikedByCurrentUser(false);
        }
        
        return dto;
    }

    private PostDTO mapToDTO(Post post) {
        return mapToDTO(post, null);
    }
}