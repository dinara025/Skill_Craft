package com.paf.skillcraft.skill_craft.controller;

import com.paf.skillcraft.skill_craft.model.FollowRequest;
import com.paf.skillcraft.skill_craft.service.FollowRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/follow")
@CrossOrigin(origins = "*") // Allow CORS for frontend
public class FollowRequestController {

    @Autowired
    private FollowRequestService followRequestService;

    /**
     * Create a new follow request
     */
    @PostMapping("/send")//http://localhost:8080/api/follow/send?senderId=UserA&receiverId=UserB
    public FollowRequest sendFollowRequest(@RequestParam String senderId, @RequestParam String receiverId) {
        return followRequestService.createFollowRequest(senderId, receiverId);
    }

    /**
     * Get all follow requests sent by the user
     */
    @GetMapping("/sent/{senderId}") 
    public List<FollowRequest> getSentRequests(@PathVariable String senderId) {
        return followRequestService.getSentRequests(senderId);
    }

    /**
     * Get all follow requests received by the user
     */
    @GetMapping("/received/{receiverId}") //http://localhost:8080/api/follow/sent/UserA
    public List<FollowRequest> getReceivedRequests(@PathVariable String receiverId) {
        return followRequestService.getReceivedRequests(receiverId);
    }

    /**
     * Update status of a follow request (accepted, declined, unfollow)
     */
    @PutMapping("/{id}/status") //PUT /api/follow/{id}/status?status=accepted
    public FollowRequest updateStatus(@PathVariable String id, @RequestParam String status) {
        return followRequestService.updateRequestStatus(id, status);
    }

    /**
     * Delete a follow request by ID (cancel/unfollow)
     */
    @DeleteMapping("/{id}") //http://localhost:8080/api/follow/id
    public ResponseEntity<Void> deleteRequest(@PathVariable String id) {
        followRequestService.deleteFollowRequest(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    /**
     * Get a follow request by ID
     */
    @GetMapping("/{id}")
    public Optional<FollowRequest> getFollowRequest(@PathVariable String id) {
        return followRequestService.getRequestById(id);
    }

        // Get number of followers for a user (receiverId)
    @GetMapping("/count/followers/{receiverId}")
    public long countFollowers(@PathVariable String receiverId) {
        return followRequestService.countFollowers(receiverId);
    }

    // Get number of users the given user is following (senderId)
    @GetMapping("/count/following/{senderId}")
    public long countFollowing(@PathVariable String senderId) {
        return followRequestService.countFollowing(senderId);
    }

}
