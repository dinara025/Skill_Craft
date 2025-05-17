package com.paf.skillcraft.skill_craft.controller;

import com.paf.skillcraft.skill_craft.model.LearningJourney;
import com.paf.skillcraft.skill_craft.service.LearningJourneyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth/learning-journey")
@CrossOrigin(origins = "*")
public class LearningJourneyController {

    @Autowired
    private LearningJourneyService learningJourneyService;

    @PostMapping
    public LearningJourney createLearningJourney(@RequestBody LearningJourney learningJourney, Authentication authentication) {
        String userId = authentication.getName(); // Assuming JWT stores userId as the principal
        return learningJourneyService.createLearningJourney(learningJourney, userId);
    }

    @GetMapping("/user/{userId}")
    public List<LearningJourney> getLearningJourneyByUser(@PathVariable String userId) {
        return learningJourneyService.getLearningJourneyByUserId(userId);
    }

    @PutMapping("/{entryId}")
    public LearningJourney updateLearningJourney(@PathVariable String entryId,
                                                @RequestBody LearningJourney updatedEntry,
                                                Authentication authentication) {
        String userId = authentication.getName();
        return learningJourneyService.updateLearningJourney(entryId, userId, updatedEntry)
                .orElseThrow(() -> new RuntimeException("Unauthorized or learning journey entry not found"));
    }

    @DeleteMapping("/{entryId}")
    public String deleteLearningJourney(@PathVariable String entryId, Authentication authentication) {
        String userId = authentication.getName();
        boolean deleted = learningJourneyService.deleteLearningJourney(entryId, userId);
        if (deleted) {
            return "Learning journey entry deleted successfully";
        } else {
            throw new RuntimeException("Unauthorized or learning journey entry not found");
        }
    }
}