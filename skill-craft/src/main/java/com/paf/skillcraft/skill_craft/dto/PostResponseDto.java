package com.paf.skillcraft.skill_craft.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PostResponseDto {
    private String id;
    private String content;
    private List<String> mediaLinks;
    private List<String> tags;
    private String template; // Added template field
    private LocalDateTime createdAt;
    private String userId;
    private String username;
    private String avatar;
    private int likeCount;

    // Constructors
    public PostResponseDto() {}

    public PostResponseDto(String id, String content, List<String> mediaLinks, List<String> tags,
                           String template, LocalDateTime createdAt, String userId, String username,
                           String avatar, int likeCount) {
        this.id = id;
        this.content = content;
        this.mediaLinks = mediaLinks;
        this.tags = tags;
        this.template = template;
        this.createdAt = createdAt;
        this.userId = userId;
        this.username = username;
        this.avatar = avatar;
        this.likeCount = likeCount;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public int getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(int likeCount) {
        this.likeCount = likeCount;
    }
}