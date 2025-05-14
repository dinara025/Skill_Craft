package com.paf.skillcraft.skill_craft.repository;

import com.paf.skillcraft.skill_craft.model.FollowRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowRequestRepository extends MongoRepository<FollowRequest, String> {
    List<FollowRequest> findBySenderId(String senderId);
    List<FollowRequest> findByReceiverId(String receiverId);
    List<FollowRequest> findBySenderIdAndReceiverId(String senderId, String receiverId);

    // ✅ NEW: Find all requests where this user is sender or receiver (for deletion or cleanup)
    List<FollowRequest> findBySenderIdOrReceiverId(String senderId, String receiverId);

    long countByReceiverIdAndStatus(String receiverId, String status);

    long countBySenderIdAndStatus(String senderId, String status);

}
