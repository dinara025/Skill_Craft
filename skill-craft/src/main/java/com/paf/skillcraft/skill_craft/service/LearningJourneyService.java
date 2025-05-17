package com.paf.skillcraft.skill_craft.service;

import com.paf.skillcraft.skill_craft.model.LearningJourney;
import com.paf.skillcraft.skill_craft.model.LearningJourney.LearningEntry;
import com.paf.skillcraft.skill_craft.model.Notification;
import com.paf.skillcraft.skill_craft.model.User;
import com.paf.skillcraft.skill_craft.repository.LearningJourneyRepository;
import com.paf.skillcraft.skill_craft.repository.NotificationRepository;
import com.paf.skillcraft.skill_craft.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class LearningJourneyService {

    private static final Logger logger = LoggerFactory.getLogger(LearningJourneyService.class);

    @Autowired
    private LearningJourneyRepository learningJourneyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public LearningJourney createLearningJourney(LearningJourney learningJourney, String currentUserId) {
        logger.info("Creating learning journey for userId: {}", currentUserId);
        learningJourney.setUserId(currentUserId);
        learningJourney.setCreatedAt(LocalDateTime.now());
        learningJourney.setUpdatedAt(LocalDateTime.now());
        LearningJourney savedJourney = learningJourneyRepository.save(learningJourney);

        // Send notification to the user
        sendNotification(currentUserId, "created a new learning journey");

        return savedJourney;
    }

    public LearningJourney addLearningEntry(String userId, LearningEntry newEntry) {
        logger.info("Adding learning entry for userId: {}, title: {}", userId, newEntry.getTitle());
        // Validate input
        if (newEntry.getTitle() == null || newEntry.getTitle().isEmpty() ||
            newEntry.getType() == null || newEntry.getDate() == null) {
            logger.error("Invalid learning entry: title, type, or date is missing");
            throw new IllegalArgumentException("Title, type, and date are required for learning entry");
        }
        if (!newEntry.getType().equals("skill") && !newEntry.getType().equals("course")) {
            logger.error("Invalid learning entry type: {}", newEntry.getType());
            throw new IllegalArgumentException("Type must be 'skill' or 'course'");
        }

        List<LearningJourney> journeys = learningJourneyRepository.findByUserId(userId);
        LearningJourney journey;
        if (journeys.isEmpty()) {
            logger.debug("No existing learning journey found for userId: {}, creating new one", userId);
            journey = new LearningJourney(userId, new ArrayList<>());
        } else {
            journey = journeys.get(0); // Assuming one LearningJourney per user
            logger.debug("Found existing learning journey for userId: {}", userId);
        }

        journey.getEntries().add(newEntry);
        journey.setUpdatedAt(LocalDateTime.now());
        LearningJourney savedJourney = learningJourneyRepository.save(journey);

        // Send notification
        sendNotification(userId, "added a new learning journey entry: " + newEntry.getTitle());

        logger.info("Successfully saved learning journey for userId: {}", userId);
        return savedJourney;
    }

    public List<LearningJourney> getLearningJourneyByUserId(String userId) {
        logger.debug("Fetching learning journey for userId: {}", userId);
        return learningJourneyRepository.findByUserId(userId);
    }

    public Optional<LearningJourney> updateLearningEntry(String userId, String entryId, LearningEntry updatedEntry) {
        logger.info("Updating learning entry for userId: {}, entryId: {}", userId, entryId);
        List<LearningJourney> journeys = learningJourneyRepository.findByUserId(userId);
        if (journeys.isEmpty()) {
            logger.warn("No learning journey found for userId: {}", userId);
            return Optional.empty();
        }

        LearningJourney journey = journeys.get(0);
        LearningEntry entryToUpdate = journey.getEntries().stream()
                .filter(entry -> entry.getTitle().equals(entryId)) // Using title as identifier for simplicity
                .findFirst()
                .orElse(null);

        if (entryToUpdate == null) {
            logger.warn("Learning entry not found for title: {}", entryId);
            return Optional.empty();
        }

        // Update fields if provided
        if (updatedEntry.getTitle() != null && !updatedEntry.getTitle().isEmpty()) {
            entryToUpdate.setTitle(updatedEntry.getTitle());
        }
        if (updatedEntry.getType() != null) {
            if (!updatedEntry.getType().equals("skill") && !updatedEntry.getType().equals("course")) {
                logger.error("Invalid learning entry type: {}", updatedEntry.getType());
                throw new IllegalArgumentException("Type must be 'skill' or 'course'");
            }
            entryToUpdate.setType(updatedEntry.getType());
        }
        if (updatedEntry.getDate() != null) {
            entryToUpdate.setDate(updatedEntry.getDate());
        }
        if (updatedEntry.getDescription() != null) {
            entryToUpdate.setDescription(updatedEntry.getDescription());
        }
        journey.setUpdatedAt(LocalDateTime.now());

        LearningJourney updatedJourney = learningJourneyRepository.save(journey);
        sendNotification(userId, "updated a learning journey entry: " + updatedEntry.getTitle());
        logger.info("Successfully updated learning journey for userId: {}", userId);
        return Optional.of(updatedJourney);
    }

    public boolean deleteLearningEntry(String userId, String entryTitle) {
        logger.info("Deleting learning entry for userId: {}, entryTitle: {}", userId, entryTitle);
        List<LearningJourney> journeys = learningJourneyRepository.findByUserId(userId);
        if (journeys.isEmpty()) {
            logger.warn("No learning journey found for userId: {}", userId);
            return false;
        }

        LearningJourney journey = journeys.get(0);
        boolean removed = journey.getEntries().removeIf(entry -> entry.getTitle().equals(entryTitle));
        if (removed) {
            journey.setUpdatedAt(LocalDateTime.now());
            learningJourneyRepository.save(journey);
            sendNotification(userId, "deleted a learning journey entry: " + entryTitle);
            logger.info("Successfully deleted learning entry for userId: {}", userId);
            return true;
        }
        logger.warn("Learning entry not found for title: {}", entryTitle);
        return false;
    }

    private void sendNotification(String userId, String message) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Notification notification = new Notification();
            notification.setRecipientId(userId);
            notification.setSenderId(userId);
            notification.setSenderUsername(user.getUsername());
            notification.setMessage(user.getUsername() + " " + message);
            notification.setType("learning_journey");
            notification.setRead(false);
            notification.setTimestamp(LocalDateTime.now());
            notificationRepository.save(notification);
            logger.debug("Sent notification to userId: {}", userId);
        } else {
            logger.warn("User not found for notification, userId: {}", userId);
        }
    }
}