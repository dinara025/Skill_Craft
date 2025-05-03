package com.paf.skillcraft.skill_craft.service;

import com.paf.skillcraft.skill_craft.model.Post;
import com.paf.skillcraft.skill_craft.model.User;
import com.paf.skillcraft.skill_craft.repository.PostRepository;
import com.paf.skillcraft.skill_craft.repository.UserRepository;
import com.paf.skillcraft.skill_craft.dto.PostResponseDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public Post createPost(Post post) {
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        post.setLikeCount(0);  // Initialize likeCount to 0
        post.setLikes(new ArrayList<>()); // Initialize likes list
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    public List<Post> getPostsByUser(String userId) {
        return postRepository.findByUserId(userId);
    }

    public void deletePost(String id) {
        postRepository.deleteById(id);
    }

    public Post updatePost(String id, Post updatedPost) {
        Optional<Post> existing = postRepository.findById(id);
        if (existing.isPresent()) {
            Post post = existing.get();
            if (updatedPost.getContent() != null) {
                post.setContent(updatedPost.getContent());
            }
            if (updatedPost.getMediaLinks() != null) {
                post.setMediaLinks(updatedPost.getMediaLinks());
            }
            if (updatedPost.getTags() != null) {
                post.setTags(updatedPost.getTags());
            }
            post.setUpdatedAt(LocalDateTime.now());
            return postRepository.save(post);
        }
        return null;
    }

    public List<PostResponseDto> getAllPostsWithUserDetails() {
        List<Post> posts = postRepository.findAll();
    
        return posts.stream().map((Post post) -> {
            User user = userRepository.findById(post.getUserId()).orElse(null);
    
            PostResponseDto dto = new PostResponseDto();
            dto.setId(post.getId());
            dto.setUserId(post.getUserId());
            dto.setUsername(user != null ? user.getUsername() : "Unknown");
            // dto.setAvatar(user != null ? user.getAvatar() : "default.png");
            dto.setContent(post.getContent());
            dto.setMediaLinks(post.getMediaLinks());
            dto.setTags(post.getTags());
            dto.setCreatedAt(post.getCreatedAt());
            dto.setLikeCount(post.getLikeCount()); // Add the likeCount to the DTO
            return dto;
        }).collect(Collectors.toList());
    }

    // Add like to post
    // PostService.java

    public Post addLike(String postId, String userId) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            if (!post.getLikes().contains(userId)) {
                post.addLike(userId); // Add the like and update likeCount
                post.setLikeCount(post.getLikes().size()); // Update like count based on the list size
                return postRepository.save(post);
            }
        }
        return null;
    }


    // Remove like from post
    public Post removeLike(String postId, String userId) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            if (post.getLikes().contains(userId)) {
                post.removeLike(userId); // Remove the like and update likeCount
                return postRepository.save(post);
            }
        }
        return null;
    }
}
