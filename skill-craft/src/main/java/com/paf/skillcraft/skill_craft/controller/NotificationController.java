package com.paf.skillcraft.skill_craft.controller;

import com.paf.skillcraft.skill_craft.model.Notification;
import com.paf.skillcraft.skill_craft.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable String userId) {
        List<Notification> notifications = notificationRepository.findByRecipientIdOrderByTimestampDesc(userId);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/markAsRead/{id}")
    public ResponseEntity<?> markAsRead(@PathVariable String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);
        notificationRepository.save(notification);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/mark-read")
    public ResponseEntity<?> markMultipleAsRead(@RequestBody NotificationIdsRequest request) {
        List<String> ids = request.getNotificationIds();
        List<Notification> notifications = notificationRepository.findAllById(ids);

        for (Notification n : notifications) {
            n.setRead(true);
        }

        notificationRepository.saveAll(notifications);
        return ResponseEntity.ok(Map.of("message", "Notifications marked as read"));
    }

    public static class NotificationIdsRequest {
        private List<String> notificationIds;

        public List<String> getNotificationIds() {
            return notificationIds;
        }

        public void setNotificationIds(List<String> notificationIds) {
            this.notificationIds = notificationIds;
        }
    }
}
