package com.paf.skillcraft.skill_craft.service;

import com.paf.skillcraft.skill_craft.model.LearningJourney;
import com.paf.skillcraft.skill_craft.model.Notification;
import com.paf.skillcraft.skill_craft.model.User;
import com.paf.skillcraft.skill_craft.repository.LearningJourneyRepository;
import com.paf.skillcraft.skill_craft.repository.NotificationRepository;
import com.paf.skillcraft.skill_craft.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LearningJourneyService {

    @Autowired
    private LearningJourneyRepository learningJourneyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public LearningJourney createLearningJourney(LearningJourney learningJourney, String currentUserId) {
        // Validate input
        if (learningJourney.getTitle() == null || learningJourney.getTitle().isEmpty() ||
            learningJourney.getType() == null || learningJourney.getDate() == null) {
            throw new IllegalArgumentException("Title, type, and date are required");
        }
        if (!learningJourney.getType().equals("skill") && !learningJourney.getType().equals("course")) {
            throw new IllegalArgumentException("Type must be 'skill' or 'course'");
        }

        learningJourney.setUserId(currentUserId);
        learningJourney.setCreatedAt(LocalDateTime.now());
        learningJourney.setUpdatedAt(LocalDateTime.now());
        LearningJourney savedEntry = learningJourneyRepository.save(learningJourney);

        // Send notification to the user
        Optional<User> userOptional = userRepository.findById(currentUserId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Notification notification = new Notification();
            notification.setRecipientId(currentUserId);
            notification.setSenderId(currentUserId);
            notification.setSenderUsername(user.getUsername());
            notification.setMessage(user.getUsername() + " added a new learning journey entry: " + learningJourney.getTitle());
            notification.setType("learning_journey");
            notification.setRead(false);
            notification.setTimestamp(LocalDateTime.now());
            notificationRepository.save(notification);
        }

        return savedEntry;
    }

    public List<LearningJourney> getLearningJourneyByUserId(String userId) {
        return learningJourneyRepository.findByUserId(userId);
    }

    public Optional<LearningJourney> updateLearningJourney(String entryId, String userId, LearningJourney updatedEntry) {
        Optional<LearningJourney> optionalEntry = learningJourneyRepository.findById(entryId);
        if (optionalEntry.isPresent()) {
            LearningJourney entry = optionalEntry.get();
            if (!entry.getUserId().equals(userId)) {
                return Optional.empty(); // Unauthorized
            }

            // Update fields if provided
            if (updatedEntry.getTitle() != null && !updatedEntry.getTitle().isEmpty()) {
                entry.setTitle(updatedEntry.getTitle());
            }
            if (updatedEntry.getType() != null) {
                if (!updatedEntry.getType().equals("skill") && !updatedEntry.getType().equals("course")) {
                    throw new IllegalArgumentException("Type must be 'skill' or 'course'");
                }
                entry.setType(updatedEntry.getType());
            }
            if (updatedEntry.getDate() != null) {
                entry.setDate(updatedEntry.getDate());
            }
            if (updatedEntry.getDescription() != null) {
                entry.setDescription(updatedEntry.getDescription());
            }
            entry.setUpdatedAt(LocalDateTime.now());

            return Optional.of(learningJourneyRepository.save(entry));
        }
        return Optional.empty();
    }

    public boolean deleteLearningJourney(String entryId, String userId) {
        Optional<LearningJourney> optionalEntry = learningJourneyRepository.findById(entryId);
        if (optionalEntry.isPresent()) {
            LearningJourney entry = optionalEntry.get();
            if (entry.getUserId().equals(userId)) {
                learningJourneyRepository.deleteById(entryId);
                return true;
            }
        }
        return false;
    }
}