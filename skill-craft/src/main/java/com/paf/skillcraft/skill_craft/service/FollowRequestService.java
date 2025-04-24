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
        List<FollowRequest> existing = followRequestRepository.findBySenderIdAndReceiverId(senderId, receiverId);
        if (!existing.isEmpty()) {
            return existing.get(0); // avoid duplicate follow requests
        }
        FollowRequest request = new FollowRequest(senderId, receiverId);
        return followRequestRepository.save(request);
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
}
