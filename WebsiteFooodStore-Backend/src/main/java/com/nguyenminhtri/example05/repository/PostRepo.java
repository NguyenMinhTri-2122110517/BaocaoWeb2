package com.nguyenminhtri.example05.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.nguyenminhtri.example05.entity.Post;

import java.util.List;

@Repository
public interface PostRepo extends JpaRepository<Post, Long> {
    List<Post> findByUserUserId(Long userId);
    List<Post> findByStatus(Integer status);
    
    @Query("SELECT COUNT(u) FROM Post p JOIN p.likedByUsers u WHERE p.id = :postId AND u.userId = :userId")
    Long countLikeByUserIdAndPostId(@Param("userId") Long userId, @Param("postId") Long postId);

    @Query("SELECT COUNT(u) > 0 FROM Post p JOIN p.likedByUsers u WHERE p.id = :postId AND u.userId = :userId")
    boolean hasUserLikedPost(@Param("userId") Long userId, @Param("postId") Long postId);

    @Modifying
    @Query(value = "INSERT INTO post_likes (user_id, post_id) VALUES (:userId, :postId)", nativeQuery = true)
    void addLike(@Param("userId") Long userId, @Param("postId") Long postId);

    @Modifying
    @Query(value = "DELETE FROM post_likes WHERE user_id = :userId AND post_id = :postId", nativeQuery = true)
    void removeLike(@Param("userId") Long userId, @Param("postId") Long postId);
}