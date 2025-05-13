package com.paf.skillcraft.skill_craft.service;

import com.paf.skillcraft.skill_craft.model.Post;
import com.paf.skillcraft.skill_craft.model.User;
import com.paf.skillcraft.skill_craft.repository.PostRepository;
import com.paf.skillcraft.skill_craft.repository.UserRepository;
import com.paf.skillcraft.skill_craft.dto.PostResponseDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public Post createPost(Post post) {
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        post.setLikeCount(0);
        post.setLikes(new ArrayList<>());

        if (post.getTemplate() == null) {
            post.setTemplate("general");
        }

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
            if (updatedPost.getTemplate() != null) {
                post.setTemplate(updatedPost.getTemplate());
            }

            post.setUpdatedAt(LocalDateTime.now());
            return postRepository.save(post);
        }

        return null;
    }

    public List<PostResponseDto> getAllPostsWithUserDetails() {
        List<Post> posts = postRepository.findAll();

        return posts.stream().map(post -> {
            User user = userRepository.findById(post.getUserId()).orElse(null);

            PostResponseDto dto = new PostResponseDto();
            dto.setId(post.getId());
            dto.setUserId(post.getUserId());
            dto.setUsername(user != null ? user.getUsername() : "Unknown");
            dto.setContent(post.getContent());
            dto.setMediaLinks(post.getMediaLinks());
            dto.setTags(post.getTags());
            dto.setTemplate(post.getTemplate());
            dto.setCreatedAt(post.getCreatedAt());
            dto.setLikeCount(post.getLikeCount());
            // dto.setLikes(post.getLikes());
            return dto;
        }).collect(Collectors.toList());
    }

    public Post addLike(String postId, String userId) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            if (!post.getLikes().contains(userId)) {
                post.addLike(userId);
                return postRepository.save(post);
            }
        }
        return null;
    }

    public Post removeLike(String postId, String userId) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            if (post.getLikes().contains(userId)) {
                post.removeLike(userId);
                return postRepository.save(post);
            }
        }
        return null;
    }
}
