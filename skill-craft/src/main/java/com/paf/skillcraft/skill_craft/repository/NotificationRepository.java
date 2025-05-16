package com.paf.skillcraft.skill_craft.repository;

import com.paf.skillcraft.skill_craft.model.Notification;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByRecipientIdOrderByTimestampDesc(String recipientId);
}

