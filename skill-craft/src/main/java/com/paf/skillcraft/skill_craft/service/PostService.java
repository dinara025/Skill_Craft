package com.paf.skillcraft.skill_craft.service;

import com.paf.skillcraft.skill_craft.dto.PostResponseDto;
import com.paf.skillcraft.skill_craft.model.LearningJourney.LearningEntry;
import com.paf.skillcraft.skill_craft.model.Post;
import com.paf.skillcraft.skill_craft.model.User;
import com.paf.skillcraft.skill_craft.repository.PostRepository;
import com.paf.skillcraft.skill_craft.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PostService {

    private static final Logger logger = LoggerFactory.getLogger(PostService.class);

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LearningJourneyService learningJourneyService;

    public Post createPost(Post post) {
        logger.info("Creating post with template: {}", post.getTemplate());
        post.setCreatedAt(LocalDateTime.now());
        post.setLikeCount(0);
        Post savedPost = postRepository.save(post);

        // If the post is of type "learning-progress", add a learning journey entry
        if ("learning-progress".equalsIgnoreCase(post.getTemplate())) {
            String skillOrCourse = extractSkillOrCourse(post.getContent());
            logger.info("Adding learning journey entry for userId: {}, skill: {}", post.getUserId(), skillOrCourse);
            LearningEntry entry = new LearningEntry(
                skillOrCourse,
                "skill", // Default to skill; could be enhanced to determine type
                LocalDateTime.now(),
                post.getContent()
            );
            try {
                learningJourneyService.addLearningEntry(post.getUserId(), entry);
                logger.info("Successfully added learning journey entry for userId: {}", post.getUserId());
            } catch (Exception e) {
                logger.error("Failed to add learning journey entry for userId: {}", post.getUserId(), e);
            }
        } else {
            logger.debug("Post template is not 'learning-progress', skipping learning journey update");
        }

        return savedPost;
    }

    private String extractSkillOrCourse(String content) {
        // Simple extraction logic: assume the skill/course is mentioned in the content
        // This could be improved with more sophisticated parsing
        String[] words = content.split(" ");
        for (String word : words) {
            if (word.startsWith("#")) {
                return word.substring(1); // Remove the hashtag
            }
        }
        return content.length() > 50 ? content.substring(0, 50) : content; // Fallback to content snippet
    }

    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    public List<Post> getPostsByUser(String userId) {
        return postRepository.findByUserId(userId);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
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
            dto.setIsLiked(post.getLikes() != null && post.getLikes().contains(currentUserId));
            return dto;
        }).collect(Collectors.toList());
    }

    public long getPostCountByUserId(String userId) {
        return postRepository.countByUserId(userId);
    }

    public Post updatePost(String id, Post updatedPost) {
        Optional<Post> existingPost = postRepository.findById(id);
        if (existingPost.isPresent()) {
            Post post = existingPost.get();
            post.setContent(updatedPost.getContent());
            post.setMediaLinks(updatedPost.getMediaLinks());
            post.setTags(updatedPost.getTags());
            post.setTemplate(updatedPost.getTemplate());
            return postRepository.save(post);
        }
        return null;
    }

    public void deletePost(String id) {
        postRepository.deleteById(id);
    }

    public Post addLike(String postId, String userId) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            List<String> likes = post.getLikes();
            if (!likes.contains(userId)) {
                likes.add(userId);
                post.setLikeCount(likes.size());
                return postRepository.save(post);
            }
        }
        return null;
    }

    public Post removeLike(String postId, String userId) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            List<String> likes = post.getLikes();
            if (likes.remove(userId)) {
                post.setLikeCount(likes.size());
                return postRepository.save(post);
            }
        }
        return null;
    }

    public List<String> findMatchingTags(String query) {
        return postRepository.findDistinctTags(query);
    }

    public List<Post> findPostsByTag(String tag, String currentUserId) {
        return postRepository.findByTagsContainingIgnoreCase(tag);
    }

    public UserRepository getUserRepository() {
        return userRepository;
    }
}