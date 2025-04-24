package com.paf.skillcraft.skill_craft.controller;

import com.paf.skillcraft.skill_craft.model.Post;
import com.paf.skillcraft.skill_craft.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    
    @Autowired
    private PostService postService;

    @PostMapping
    public Post createPost(@RequestBody Post post) {
        return postService.createPost(post);
    }

    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/{id}")
    public Optional<Post> getPostById(@PathVariable String id) {
        return postService.getPostById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Post> getPostsByUser(@PathVariable String userId) {
        return postService.getPostsByUser(userId);
    }

    @PutMapping("/{id}")
    public Post updatePost(@PathVariable String id, @RequestBody Post post) {
        return postService.updatePost(id, post);
    }

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable String id) {
        postService.deletePost(id);
    }
}
