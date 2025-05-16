package com.paf.skillcraft.skill_craft.controller;

import com.paf.skillcraft.skill_craft.dto.PostResponseDto;
import com.paf.skillcraft.skill_craft.model.Post;
import com.paf.skillcraft.skill_craft.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        if (post.getTemplate() != null && !isValidTemplate(post.getTemplate())) {
            return ResponseEntity.badRequest().body(null);
        }
        Post createdPost = postService.createPost(post);
        return ResponseEntity.ok(createdPost);
    }

    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getAllPosts(@RequestParam(required = false) String currentUserId) {
        List<PostResponseDto> posts = postService.getAllPostsWithUserDetails(currentUserId != null ? currentUserId : "");
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        return postService.getPostById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getPostsByUser(@PathVariable String userId) {
        List<Post> posts = postService.getPostsByUser(userId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/count/{userId}")
    public ResponseEntity<Long> getPostCount(@PathVariable String userId) {
        long count = postService.getPostCountByUserId(userId);
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Post post) {
        if (post.getTemplate() != null && !isValidTemplate(post.getTemplate())) {
            return ResponseEntity.badRequest().body(null);
        }
        Post updatedPost = postService.updatePost(id, post);
        if (updatedPost != null) {
            return ResponseEntity.ok(updatedPost);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/like/{userId}")
    public ResponseEntity<Post> likePost(@PathVariable String id, @PathVariable String userId) {
        Post updatedPost = postService.addLike(id, userId);
        if (updatedPost != null) {
            return ResponseEntity.ok(updatedPost);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/unlike/{userId}")
    public ResponseEntity<Post> unlikePost(@PathVariable String id, @PathVariable String userId) {
        Post updatedPost = postService.removeLike(id, userId);
        if (updatedPost != null) {
            return ResponseEntity.ok(updatedPost);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/likes")
    public ResponseEntity<List<String>> getLikedUsers(@PathVariable String id) {
        Optional<Post> postOptional = postService.getPostById(id);
        return postOptional.map(post -> ResponseEntity.ok(post.getLikes()))
                .orElse(ResponseEntity.notFound().build());
    }

    private boolean isValidTemplate(String template) {
        return template.equals("learning-progress") ||
               template.equals("ask-question") ||
               template.equals("general");
    }
}