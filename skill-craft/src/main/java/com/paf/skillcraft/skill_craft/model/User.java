package com.paf.skillcraft.skill_craft.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String username;
    private String password;

    private String role = "USER";  // NEW: default role

    // New profile fields
    private String bio;
    private String profilePhoto;
    private String education;
    private List<String> skills;

    public User() {}

    public User(String username, String password) {
        this.username = username;
        this.password = password;
        this.role = "USER";  // Assign default role
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    // New getters and setters for profile fields
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
}