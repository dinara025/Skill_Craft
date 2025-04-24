package com.paf.skillcraft.skill_craft.controller;

import com.paf.skillcraft.skill_craft.model.FollowRequest;
import com.paf.skillcraft.skill_craft.service.FollowRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/follow")
@CrossOrigin(origins = "*") // allow CORS for frontend
public class FollowRequestController {

    @Autowired
    private FollowRequestService followRequestService;

    @PostMapping("/send")
    public FollowRequest sendFollowRequest(@RequestParam String senderId, @RequestParam String receiverId) {
        return followRequestService.createFollowRequest(senderId, receiverId);
    }

    @GetMapping("/sent/{senderId}")
    public List<FollowRequest> getSentRequests(@PathVariable String senderId) {
        return followRequestService.getSentRequests(senderId);
    }

    @GetMapping("/received/{receiverId}")
    public List<FollowRequest> getReceivedRequests(@PathVariable String receiverId) {
        return followRequestService.getReceivedRequests(receiverId);
    }

    @PutMapping("/{id}/status")
    public FollowRequest updateStatus(@PathVariable String id, @RequestParam String status) {
        return followRequestService.updateRequestStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public void deleteRequest(@PathVariable String id) {
        followRequestService.deleteFollowRequest(id);
    }

    @GetMapping("/{id}")
    public Optional<FollowRequest> getFollowRequest(@PathVariable String id) {
        return followRequestService.getRequestById(id);
    }
}
