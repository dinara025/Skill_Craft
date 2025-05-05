package com.paf.skillcraft.skill_craft.controller;

import com.paf.skillcraft.skill_craft.model.User;
import com.paf.skillcraft.skill_craft.security.CustomUserDetails;
import com.paf.skillcraft.skill_craft.security.JwtUtil;
import com.paf.skillcraft.skill_craft.service.UserService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;  // To return better responses
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")  // Matches SecurityConfig public route
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // ----------- REGISTER -----------
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestParam String username, @RequestParam String password) {
        User newUser = userService.register(username, password);
        if (newUser == null) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        return ResponseEntity.ok(newUser);
    }

    // ----------- LOGIN (Returns JWT) -----------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username, @RequestParam String password) {
        User user = userService.login(username, password);

        if (user == null) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        // --- Create JWT ---
        CustomUserDetails userDetails = new CustomUserDetails(user);
        String jwtToken = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(jwtToken);
    }

    // ----------- GET ALL USERS -----------
    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
}
