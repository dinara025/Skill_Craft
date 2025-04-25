package com.paf.skillcraft.skill_craft.service;

import com.paf.skillcraft.skill_craft.model.User;
import com.paf.skillcraft.skill_craft.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User register(String username, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            return null; // already exists
        }
        User user = new User(username, password); // hash later
        return userRepository.save(user);
    }

    public User login(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            return userOpt.get();
        }
        return null; // login failed
    }
}
