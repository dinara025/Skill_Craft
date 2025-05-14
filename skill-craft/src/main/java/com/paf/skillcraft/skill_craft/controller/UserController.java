package com.paf.skillcraft.skill_craft.controller;

import com.paf.skillcraft.skill_craft.model.User;
import com.paf.skillcraft.skill_craft.security.CustomUserDetails;
import com.paf.skillcraft.skill_craft.security.JwtUtil;
import com.paf.skillcraft.skill_craft.service.UserService;
import com.paf.skillcraft.skill_craft.dto.AuthResponse;

import java.util.List;
import java.util.Optional;
import java.io.IOException;
import jakarta.servlet.http.HttpServletResponse;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;  // To return better responses
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
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

    // ✅ Generate token for the new user
    CustomUserDetails userDetails = new CustomUserDetails(newUser);
    String jwtToken = jwtUtil.generateToken(userDetails);

    // ✅ Return token in JSON
    return ResponseEntity.ok().body(new AuthResponse(jwtToken));
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

    @GetMapping("/userDetails/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userService.getUserByUsername(username);
        return user.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ----------- UPDATE PROFILE -----------
    @PostMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestParam String username,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) String profilePhoto,
            @RequestParam(required = false) String education,
            @RequestParam(required = false) List<String> skills) {
        User updatedUser = userService.updateProfile(username, bio, profilePhoto, education, skills);
        if (updatedUser == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/oauth2/success")
    public void oauth2Success(OAuth2AuthenticationToken authentication, HttpServletResponse response) throws IOException
    {
    OAuth2User oauthUser = authentication.getPrincipal();

    String email = oauthUser.getAttribute("email");
    String name = oauthUser.getAttribute("name");

    // Check if the user already exists by username (email in this case)
    Optional<User> userOpt = userService.getUserByUsername(email);
    User user;

    if (userOpt.isPresent()) {
        user = userOpt.get();
    } else {
        // Create a new user with only username and a dummy password
        user = new User();
        user.setUsername(email);
        user.setPassword(""); // no password for OAuth users
        user.setRole("USER"); // optional but explicit
        user = userService.saveUser(user);
    }

    // Generate JWT using your CustomUserDetails wrapper
    CustomUserDetails userDetails = new CustomUserDetails(user);
    String jwtToken = jwtUtil.generateToken(userDetails);

    response.sendRedirect("http://localhost:3000/oauth2/success?token=" + jwtToken);

}


    
}