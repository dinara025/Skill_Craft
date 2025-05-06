package com.paf.skillcraft.skill_craft.controller;

import com.paf.skillcraft.skill_craft.model.Post;
import com.paf.skillcraft.skill_craft.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.paf.skillcraft.skill_craft.dto.PostResponseDto;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping
    public Post createPost(@RequestBody Post post) {
        return postService.createPost(post);
    }

    @GetMapping
    public List<PostResponseDto> getAllPosts() {
        return postService.getAllPostsWithUserDetails();
    }

    @GetMapping("/{id}")
    public Optional<Post> getPostById(@PathVariable String id) {
        return postService.getPostById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Post> getPostsByUser(@PathVariable String userId) {
        return postService.getPostsByUser(userId);
    }

    // @GetMapping("/user/{username}")
    // public List<Post> getPostsByUsername(@PathVariable String username) {
    //     return postService.getPostsByUsername(username);
    // }

    @PutMapping("/{id}")
    public Post updatePost(@PathVariable String id, @RequestBody Post post) {
        return postService.updatePost(id, post);
    }

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable String id) {
        postService.deletePost(id);
    }

    // Endpoint to add a like to a post
    @PutMapping("/{id}/like/{userId}")
    public Post addLikeToPost(@PathVariable String id, @PathVariable String userId) {
        return postService.addLike(id, userId);
    }

    // Endpoint to remove a like from a post
    @PutMapping("/{id}/unlike/{userId}")
    public Post removeLikeFromPost(@PathVariable String id, @PathVariable String userId) {
        return postService.removeLike(id, userId);
    }

    
}
