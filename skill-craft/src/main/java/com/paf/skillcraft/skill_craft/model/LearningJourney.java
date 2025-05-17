package com.paf.skillcraft.skill_craft.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "learning_journey")
public class LearningJourney {

    @Id
    private String id;

    private String userId;
    private List<LearningEntry> entries;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public LearningJourney() {
        this.entries = new ArrayList<>();
    }

    public LearningJourney(String userId, List<LearningEntry> entries) {
        this.userId = userId;
        this.entries = entries != null ? entries : new ArrayList<>();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Nested class to represent a single learning entry
    public static class LearningEntry {
        private String title;
        private String type; // "skill" or "course"
        private LocalDateTime date;
        private String description;

        public LearningEntry() {}

        public LearningEntry(String title, String type, LocalDateTime date, String description) {
            this.title = title;
            this.type = type;
            this.date = date;
            this.description = description;
        }

        // Getters and Setters
        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public LocalDateTime getDate() {
            return date;
        }

        public void setDate(LocalDateTime date) {
            this.date = date;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public List<LearningEntry> getEntries() {
        return entries;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setEntries(List<LearningEntry> entries) {
        this.entries = entries;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}