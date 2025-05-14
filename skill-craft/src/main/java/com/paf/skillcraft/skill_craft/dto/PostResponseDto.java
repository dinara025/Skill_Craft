package com.paf.skillcraft.skill_craft.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class PostResponseDto {
    private String id;
    private String title;
    private String content;
    private List<String> mediaLinks;
    private List<String> tags;
    private String template;
    private LocalDateTime createdAt;
    private String userId;
    private String username;
    private String avatar;
    private int likeCount;
    private List<String> likes;
    private boolean isLiked;

    // Constructors
    public PostResponseDto() {
        this.mediaLinks = new ArrayList<>();
        this.tags = new ArrayList<>();
        this.likes = new ArrayList<>();
    }

    public PostResponseDto(String id, String title, String content, List<String> mediaLinks, List<String> tags,
                           String template, LocalDateTime createdAt, String userId, String username,
                           String avatar, int likeCount, List<String> likes, boolean isLiked) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.mediaLinks = mediaLinks != null ? mediaLinks : new ArrayList<>();
        this.tags = tags != null ? tags : new ArrayList<>();
        this.template = template;
        this.createdAt = createdAt;
        this.userId = userId;
        this.username = username;
        this.avatar = avatar;
        this.likeCount = likeCount;
        this.likes = likes != null ? likes : new ArrayList<>();
        this.isLiked = isLiked;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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
        this.mediaLinks = mediaLinks != null ? mediaLinks : new ArrayList<>();
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags != null ? tags : new ArrayList<>();
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

    // public void setAvatar(String avatar BIC) {
    //     this.avatar = avatar;
    // }

    public int getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(int likeCount) {
        this.likeCount = likeCount;
    }

    public List<String> getLikes() {
        return likes;
    }

    public void setLikes(List<String> likes) {
        this.likes = likes != null ? likes : new ArrayList<>();
    }

    public boolean getIsLiked() {
        return isLiked;
    }

    public void setIsLiked(boolean isLiked) {
        this.isLiked = isLiked;
    }
}