package com.paf.skillcraft.skill_craft.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String userId;
    private String content;
    private List<String> mediaLinks;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> likes; // List of user IDs who liked the post
    private int likeCount; // Like count

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<String> getMediaLinks() {
        return mediaLinks;
    }

    public void setMediaLinks(List<String> mediaLinks) {
        this.mediaLinks = mediaLinks;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<String> getLikes() {
        return likes;
    }

    public void setLikes(List<String> likes) {
        this.likes = likes;
    }

    public int getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(int likeCount) {
        this.likeCount = likeCount;
    }

    // Method to add a like
    public void addLike(String userId) {
        if (likes == null) {
            likes = new ArrayList<>();
        }
        if (!likes.contains(userId)) {
            likes.add(userId);
            likeCount++; // Increment the like count
        }
    }

    // Method to remove a like
    public void removeLike(String userId) {
        if (likes != null && likes.remove(userId)) {
            likeCount--; // Decrement the like count
        }
    }
}
