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
    @PostMapping("/send")
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
    @GetMapping("/received/{receiverId}")
    public List<FollowRequest> getReceivedRequests(@PathVariable String receiverId) {
        return followRequestService.getReceivedRequests(receiverId);
    }

    /**
     * Update status of a follow request (accepted, declined, unfollow)
     */
    @PutMapping("/{id}/status")
    public FollowRequest updateStatus(@PathVariable String id, @RequestParam String status) {
        return followRequestService.updateRequestStatus(id, status);
    }

    /**
     * Delete a follow request by ID (cancel/unfollow)
     */
    @DeleteMapping("/{id}")
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
}
