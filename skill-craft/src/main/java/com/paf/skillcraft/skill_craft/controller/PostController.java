package com.paf.skillcraft.skill_craft.controller;

import com.paf.skillcraft.skill_craft.model.Post;
import com.paf.skillcraft.skill_craft.service.PostService;
import com.paf.skillcraft.skill_craft.dto.PostResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth/posts")
public class PostController {

    @Autowired
    private PostService postService;

    // Create a new post
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        // Validate template field if necessary
        if (post.getTemplate() != null && !isValidTemplate(post.getTemplate())) {
            return ResponseEntity.badRequest().body(null);
        }
        Post createdPost = postService.createPost(post);
        return ResponseEntity.ok(createdPost);
    }

    // Get all posts with user details
    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getAllPosts() {
        List<PostResponseDto> posts = postService.getAllPostsWithUserDetails();
        return ResponseEntity.ok(posts);
    }

    // Get a post by ID
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Post>> getPostById(@PathVariable String id) {
        Optional<Post> post = postService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    // Get posts by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getPostsByUser(@PathVariable String userId) {
        List<Post> posts = postService.getPostsByUser(userId);
        return ResponseEntity.ok(posts);
    }

    // Update a post
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Post post) {
        // Validate template field if necessary
        if (post.getTemplate() != null && !isValidTemplate(post.getTemplate())) {
            return ResponseEntity.badRequest().body(null);
        }
        Post updatedPost = postService.updatePost(id, post);
        return ResponseEntity.ok(updatedPost);
    }

    // Delete a post
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint to add a like to a post
    @PutMapping("/{id}/like/{userId}")
    public ResponseEntity<Post> addLikeToPost(@PathVariable String id, @PathVariable String userId) {
        Post updatedPost = postService.addLike(id, userId);
        return ResponseEntity.ok(updatedPost);
    }

    // Endpoint to remove a like from a post
    @PutMapping("/{id}/unlike/{userId}")
    public ResponseEntity<Post> removeLikeFromPost(@PathVariable String id, @PathVariable String userId) {
        Post updatedPost = postService.removeLike(id, userId);
        return ResponseEntity.ok(updatedPost);
    }

    // Helper method to validate template values
    private boolean isValidTemplate(String template) {
        return template != null && (
            template.equals("learning-progress") ||
            template.equals("ask-question") ||
            template.equals("general")
        );
    }
}