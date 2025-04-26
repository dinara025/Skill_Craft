package com.paf.skillcraft.skill_craft.service;

import com.paf.skillcraft.skill_craft.model.Comment;
import com.paf.skillcraft.skill_craft.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public Comment createComment(Comment comment) {
        comment.setCreatedAt(java.time.LocalDateTime.now());
        comment.setUpdatedAt(java.time.LocalDateTime.now());
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId);
    }

    public Optional<Comment> updateComment(String commentId, String userId, String newContent) {
        Optional<Comment> optionalComment = commentRepository.findById(commentId);
        if (optionalComment.isPresent()) {
            Comment comment = optionalComment.get();
            if (comment.getUserId().equals(userId)) {
                comment.setContent(newContent);
                comment.setUpdatedAt(java.time.LocalDateTime.now());
                return Optional.of(commentRepository.save(comment));
            }
        }
        return Optional.empty();
    }

    public boolean deleteComment(String commentId, String requesterId, String postOwnerId) {
        Optional<Comment> optionalComment = commentRepository.findById(commentId);
        if (optionalComment.isPresent()) {
            Comment comment = optionalComment.get();
            if (comment.getUserId().equals(requesterId) || postOwnerId.equals(requesterId)) {
                commentRepository.deleteById(commentId);
                return true;
            }
        }
        return false;
    }
}

