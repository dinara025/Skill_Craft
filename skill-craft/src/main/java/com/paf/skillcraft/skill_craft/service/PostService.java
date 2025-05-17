package com.paf.skillcraft.skill_craft.service;

import com.paf.skillcraft.skill_craft.model.LearningJourney;
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
import java.util.Set;
import java.util.HashSet;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LearningJourneyService learningJourneyService;

    public Post createPost(Post post) {
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        post.setLikeCount(0);
        Post savedPost = postRepository.save(post);

        // Update or create learning journey if the post uses the "learning-progress" template
        if ("learning-progress".equals(post.getTemplate())) {
            List<LearningJourney> existingJourneys = learningJourneyService.getLearningJourneyByUserId(post.getUserId());
            LearningJourney learningJourney;

            if (existingJourneys.isEmpty()) {
                // Create a new learning journey
                learningJourney = new LearningJourney();
                learningJourney.setUserId(post.getUserId());
                learningJourney.setTitle("My Skill Journey");
                learningJourney.setType("skill");
                learningJourney.setDate(LocalDateTime.of(2025, 5, 17, 13, 21)); // Today's date: May 17, 2025, 01:21 PM
                learningJourney.setDescription(post.getContent());
                learningJourneyService.createLearningJourney(learningJourney, post.getUserId());
            } else {
                // Update the existing learning journey (use the first one since only one is allowed)
                learningJourney = existingJourneys.get(0);
                learningJourney.setDescription(post.getContent());
                learningJourney.setDate(LocalDateTime.of(2025, 5, 17, 13, 21)); // Today's date: May 17, 2025, 01:21 PM
                learningJourney.setUpdatedAt(LocalDateTime.now());
                learningJourneyService.updateLearningJourney(learningJourney.getId(), post.getUserId(), learningJourney);
            }
        }

        return savedPost;
    }

    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    public List<Post> getPostsByUser(String userId) {
        return postRepository.findByUserId(userId);
    }

    public long getPostCountByUserId(String userId) {
        return postRepository.countByUserId(userId);
    }

    public Post updatePost(String id, Post updatedPost) {
        Optional<Post> optionalPost = postRepository.findById(id);
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
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

    public void deletePost(String id) {
        postRepository.deleteById(id);
    }

    public Post addLike(String postId, String userId) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            post.addLike(userId);
            return postRepository.save(post);
        }
        return null;
    }

    public Post removeLike(String postId, String userId) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            post.removeLike(userId);
            return postRepository.save(post);
        }
        return null;
    }

    public List<String> findMatchingTags(String query) {
        List<Post> posts = postRepository.findDistinctTagsByTagContainingIgnoreCase(query);
        Set<String> distinctTags = new HashSet<>();
        for (Post post : posts) {
            if (post.getTags() != null) {
                for (String tag : post.getTags()) {
                    if (tag.toLowerCase().contains(query.toLowerCase())) {
                        distinctTags.add(tag);
                    }
                }
            }
        }
        return distinctTags.stream().sorted().collect(Collectors.toList());
    }

    public List<Post> findPostsByTag(String tag, String currentUserId) {
        return postRepository.findByTagsContainingIgnoreCase(tag);
    }

    public List<PostResponseDto> getAllPostsWithUserDetails(String currentUserId) {
        List<Post> posts = postRepository.findAll();
        return posts.stream().map(post -> {
            Optional<User> userOptional = userRepository.findById(post.getUserId());
            User user = userOptional.orElse(null);
            PostResponseDto dto = new PostResponseDto();
            dto.setId(post.getId());
            dto.setContent(post.getContent());
            dto.setMediaLinks(post.getMediaLinks());
            dto.setTags(post.getTags());
            dto.setTemplate(post.getTemplate());
            dto.setCreatedAt(post.getCreatedAt());
            dto.setUserId(post.getUserId());
            dto.setUsername(user != null ? user.getUsername() : "Unknown");
            dto.setAvatar(user != null ? user.getProfilePhoto() : null);
            dto.setLikeCount(post.getLikeCount());
            dto.setLikes(post.getLikes());
            dto.setIsLiked(post.getLikes().contains(currentUserId));
            return dto;
        }).collect(Collectors.toList());
    }

    public UserRepository getUserRepository() {
        return userRepository;
    }
}