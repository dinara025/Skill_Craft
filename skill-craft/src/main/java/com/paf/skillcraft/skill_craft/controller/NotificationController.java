package com.paf.skillcraft.skill_craft.controller;

import com.paf.skillcraft.skill_craft.model.Notification;
import com.paf.skillcraft.skill_craft.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth/notifications")
// @CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.PUT, RequestMethod.OPTIONS}, allowedHeaders = {"Authorization", "Content-Type"}, allowCredentials = true)
@CrossOrigin(origins = "*")
public class NotificationController {

    private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable String userId) {
        logger.info("Fetching notifications for user: {}", userId);
        List<Notification> notifications = notificationService.getNotificationsByUserId(userId);
        logger.info("Returning notifications: {}", notifications);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/mark-read")
    public ResponseEntity<String> markNotificationsAsRead(@RequestBody MarkReadRequest request) {
        logger.info("Marking notifications as read: {}", request.getNotificationIds());
        notificationService.markNotificationsAsRead(request.getNotificationIds());
        return ResponseEntity.ok("Notifications marked as read");
    }

    // DTO for mark-read request
    private static class MarkReadRequest {
        private List<String> notificationIds;

        public List<String> getNotificationIds() {
            return notificationIds;
        }

        public void setNotificationIds(List<String> notificationIds) {
            this.notificationIds = notificationIds;
        }
    }
}