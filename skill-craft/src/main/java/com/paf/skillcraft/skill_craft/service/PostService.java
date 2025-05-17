package com.paf.skillcraft.skill_craft.service;

import com.paf.skillcraft.skill_craft.model.Post;
import com.paf.skillcraft.skill_craft.model.User;
import com.paf.skillcraft.skill_craft.model.Notification;
import com.paf.skillcraft.skill_craft.repository.PostRepository;
import com.paf.skillcraft.skill_craft.repository.UserRepository;
import com.paf.skillcraft.skill_craft.repository.NotificationRepository;
import com.paf.skillcraft.skill_craft.dto.PostResponseDto;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PostService {

    private static final Logger logger = LoggerFactory.getLogger(PostService.class);

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public UserRepository getUserRepository() {
        return userRepository;
    }

    public Post createPost(Post post) {
        if (post == null) {
            throw new IllegalArgumentException("Post cannot be null");
        }
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
        if (id == null || id.isEmpty()) {
            throw new IllegalArgumentException("Post ID cannot be null or empty");
        }
        return postRepository.findById(id);
    }

    public List<Post> getPostsByUser(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be null or empty");
        }
        return postRepository.findByUserId(userId);
    }

    public long getPostCountByUserId(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be null or empty");
        }
        return postRepository.countByUserId(userId);
    }

    public void deletePost(String id) {
        if (id == null || id.isEmpty()) {
            throw new IllegalArgumentException("Post ID cannot be null or empty");
        }
        postRepository.deleteById(id);
    }

    public Post updatePost(String id, Post updatedPost) {
        if (id == null || id.isEmpty() || updatedPost == null) {
            throw new IllegalArgumentException("Invalid post ID or post data");
        }
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

        throw new NoSuchElementException("Post not found with ID: " + id);
    }

    public List<PostResponseDto> getAllPostsWithUserDetails(String currentUserId) {
        List<Post> posts = postRepository.findAll();

        return posts.stream().map(post -> {
            User user = userRepository.findById(post.getUserId()).orElse(null);

            PostResponseDto responseDto = new PostResponseDto();
            responseDto.setId(post.getId());
            responseDto.setUserId(post.getUserId());
            responseDto.setUsername(user != null ? user.getUsername() : "Unknown");
            responseDto.setAvatar(user != null ? user.getProfilePhoto() : null);
            responseDto.setContent(post.getContent());
            responseDto.setMediaLinks(post.getMediaLinks());
            responseDto.setTags(post.getTags());
            responseDto.setTemplate(post.getTemplate());
            responseDto.setCreatedAt(post.getCreatedAt());
            responseDto.setLikeCount(post.getLikeCount());
            responseDto.setLikes(post.getLikes());
            responseDto.setIsLiked(currentUserId != null && post.getLikes().contains(currentUserId));
            return responseDto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public Post addLike(String postId, String userId) {
        if (postId == null || userId == null) {
            throw new IllegalArgumentException("Post ID and User ID cannot be null");
        }
        Optional<Post> postOptional = postRepository.findById(postId);
        Optional<User> userOptional = userRepository.findById(userId);

        if (postOptional.isEmpty()) {
            throw new NoSuchElementException("Post not found with ID: " + postId);
        }
        if (userOptional.isEmpty()) {
            throw new NoSuchElementException("User not found with ID: " + userId);
        }

        Post post = postOptional.get();
        if (post.getLikes().contains(userId)) {
            return post; // Already liked
        }

        post.addLike(userId);
        postRepository.save(post);

        // Send notification to post owner if not self-liked
        if (!post.getUserId().equals(userId)) {
            User sender = userOptional.get();
            String senderUsername = sender.getUsername() != null ? sender.getUsername() : "Unknown User";
            Notification notification = new Notification();
            notification.setRecipientId(post.getUserId());
            notification.setSenderId(userId);
            notification.setSenderUsername(senderUsername);
            notification.setPostId(postId);
            notification.setMessage(senderUsername + " liked your post");
            notification.setType("like");
            notification.setRead(false);
            notification.setTimestamp(LocalDateTime.now());
            logger.info("Creating like notification for user {}: {}", post.getUserId(), notification.getMessage());
            notificationRepository.save(notification);
        }

        return post;
    }

    @Transactional
    public Post removeLike(String postId, String userId) {
        if (postId == null || userId == null) {
            throw new IllegalArgumentException("Post ID and User ID cannot be null");
        }
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isEmpty()) {
            throw new NoSuchElementException("Post not found with ID: " + postId);
        }

        Post post = postOptional.get();
        if (!post.getLikes().contains(userId)) {
            return post; // Not liked
        }

        post.removeLike(userId);
        return postRepository.save(post);
    }

    public List<Post> findPostsByTag(String tag, String currentUserId) {
        return postRepository.findByTagsContainingIgnoreCase(tag);
    }

    public List<String> findMatchingTags(String query) {
        // Fetch all posts and extract unique tags that match the query
        List<Post> posts = postRepository.findAll();
        return posts.stream()
                .flatMap(post -> post.getTags().stream())
                .filter(tag -> tag.toLowerCase().contains(query.toLowerCase()))
                .distinct()
                .collect(Collectors.toList());
    }
}