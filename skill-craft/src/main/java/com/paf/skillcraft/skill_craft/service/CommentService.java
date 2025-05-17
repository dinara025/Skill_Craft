package com.paf.skillcraft.skill_craft.service;

import com.paf.skillcraft.skill_craft.model.Comment;
import com.paf.skillcraft.skill_craft.model.Notification;
import com.paf.skillcraft.skill_craft.model.Post;
import com.paf.skillcraft.skill_craft.model.User;
import com.paf.skillcraft.skill_craft.repository.CommentRepository;
import com.paf.skillcraft.skill_craft.repository.NotificationRepository;
import com.paf.skillcraft.skill_craft.repository.PostRepository;
import com.paf.skillcraft.skill_craft.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public Comment createComment(Comment comment) {
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
        Comment savedComment = commentRepository.save(comment);

        // Send notification to post owner
        Optional<Post> postOptional = postRepository.findById(comment.getPostId());
        Optional<User> userOptional = userRepository.findById(comment.getUserId());
        if (postOptional.isPresent() && userOptional.isPresent()) {
            Post post = postOptional.get();
            User sender = userOptional.get();
            if (!post.getUserId().equals(comment.getUserId())) {
                Notification notification = new Notification();
                notification.setRecipientId(post.getUserId());
                notification.setSenderId(comment.getUserId());
                notification.setSenderUsername(sender.getUsername());
                notification.setPostId(comment.getPostId());
                notification.setMessage(sender.getUsername() + " commented on your post");
                notification.setType("comment");
                notification.setRead(false);
                notification.setTimestamp(LocalDateTime.now());
                notificationRepository.save(notification);
            }
        }

        return savedComment;
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
                comment.setUpdatedAt(LocalDateTime.now());
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