package com.paf.skillcraft.skill_craft.service;

import com.paf.skillcraft.skill_craft.model.Notification;
import com.paf.skillcraft.skill_craft.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getNotificationsByUserId(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be null or empty");
        }
        return notificationRepository.findByRecipientIdOrderByTimestampDesc(userId);
    }

    public void markNotificationsAsRead(List<String> notificationIds) {
        if (notificationIds == null || notificationIds.isEmpty()) {
            return;
        }
        for (String id : notificationIds) {
            Optional<Notification> notificationOptional = notificationRepository.findById(id);
            if (notificationOptional.isPresent()) {
                Notification notification = notificationOptional.get();
                if (!notification.isRead()) {
                    notification.setRead(true);
                    notificationRepository.save(notification);
                }
            }
        }
    }
}