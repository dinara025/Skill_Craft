package com.paf.skillcraft.skill_craft.service;

import com.paf.skillcraft.skill_craft.model.FollowRequest;
import com.paf.skillcraft.skill_craft.repository.FollowRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FollowRequestService {

    @Autowired
    private FollowRequestRepository followRequestRepository;

    public FollowRequest createFollowRequest(String senderId, String receiverId) {

        // Check if the same direction request exists
        List<FollowRequest> existing = followRequestRepository.findBySenderIdAndReceiverId(senderId, receiverId);

        if (!existing.isEmpty()) {
            FollowRequest existingRequest = existing.get(0);
            String status = existingRequest.getStatus();

            // Only block if current status is not 'unfollow' or 'declined'
            if (!"unfollow".equalsIgnoreCase(status) && !"declined".equalsIgnoreCase(status)) {
                return existingRequest; // Already exists, no need to create new
            }
        }

        // Check if reverse direction request exists (receiver -> sender)
        List<FollowRequest> reverse = followRequestRepository.findBySenderIdAndReceiverId(receiverId, senderId);

        if (!reverse.isEmpty()) {
            FollowRequest reverseRequest = reverse.get(0);
            String reverseStatus = reverseRequest.getStatus();
        
            // If already accepted, no need for a new request
            if ("accepted".equalsIgnoreCase(reverseStatus)) {
                return reverseRequest; // BLOCK creating duplicate accepted requests
            }
            // ✅ Allow creating a new request EVEN IF the reverse request is pending, unfollow, or declined
        }
        

        // Otherwise, create a NEW follow request
        FollowRequest newRequest = new FollowRequest(senderId, receiverId);
        return followRequestRepository.save(newRequest);
    }

    public List<FollowRequest> getSentRequests(String senderId) {
        return followRequestRepository.findBySenderId(senderId);
    }

    public List<FollowRequest> getReceivedRequests(String receiverId) {
        return followRequestRepository.findByReceiverId(receiverId);
    }

    public Optional<FollowRequest> getRequestById(String id) {
        return followRequestRepository.findById(id);
    }

    public FollowRequest updateRequestStatus(String id, String status) {
        Optional<FollowRequest> requestOpt = followRequestRepository.findById(id);
        if (requestOpt.isPresent()) {
            FollowRequest request = requestOpt.get();
            request.setStatus(status);
            return followRequestRepository.save(request);
        }
        return null;
    }

    public void deleteFollowRequest(String id) {
        followRequestRepository.deleteById(id);
    }

    public long countFollowers(String receiverId) {
        return followRequestRepository.countByReceiverIdAndStatus(receiverId, "accepted");
    }
    
    public long countFollowing(String senderId) {
        return followRequestRepository.countBySenderIdAndStatus(senderId, "accepted");
    }
    
}
