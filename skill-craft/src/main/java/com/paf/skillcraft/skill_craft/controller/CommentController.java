package com.paf.skillcraft.skill_craft.controller;

import com.paf.skillcraft.skill_craft.model.Comment;
import com.paf.skillcraft.skill_craft.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping
    public Comment createComment(@RequestBody Comment comment) {
        return commentService.createComment(comment);
    }

    @GetMapping("/post/{postId}")
    public List<Comment> getCommentsByPost(@PathVariable String postId) {
        return commentService.getCommentsByPostId(postId);
    }

    @PutMapping("/{commentId}")
    public Comment updateComment(@PathVariable String commentId,
                                  @RequestParam String userId,
                                  @RequestParam String newContent) {
        return commentService.updateComment(commentId, userId, newContent)
                .orElseThrow(() -> new RuntimeException("Unauthorized or comment not found"));
    }

    @DeleteMapping("/{commentId}")
    public String deleteComment(@PathVariable String commentId,
                                @RequestParam String requesterId,
                                @RequestParam String postOwnerId) {
        boolean deleted = commentService.deleteComment(commentId, requesterId, postOwnerId);
        if (deleted) return "Comment deleted successfully";
        else throw new RuntimeException("Unauthorized or comment not found");
    }
}

