package com.paf.skillcraft.skill_craft.service;

import com.paf.skillcraft.skill_craft.model.User;
import com.paf.skillcraft.skill_craft.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;  // 🔥 IMPORTANT: We use this to hash and verify passwords

    // ----------- REGISTER -----------
    public User register(String username, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            return null; // User already exists
        }
        // 🔥 Hash the password before saving
        String hashedPassword = passwordEncoder.encode(password);
        User user = new User(username, hashedPassword);
        return userRepository.save(user);
    }

    // ----------- LOGIN -----------
    public User login(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // 🔥 Compare raw password with hashed password
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
        }
        return null; // login failed
    }

    // ----------- GET ALL USERS -----------
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
}
