package com.paf.skillcraft.skill_craft.controller;

import com.paf.skillcraft.skill_craft.model.LearningJourney;
import com.paf.skillcraft.skill_craft.model.LearningJourney.LearningEntry;
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
        String userId = authentication.getName();
        return learningJourneyService.createLearningJourney(learningJourney, userId);
    }

    @PostMapping("/entry")
    public LearningJourney addLearningEntry(@RequestBody LearningEntry entry, Authentication authentication) {
        String userId = authentication.getName();
        return learningJourneyService.addLearningEntry(userId, entry);
    }

    @GetMapping("/user/{userId}")
    public List<LearningJourney> getLearningJourneyByUser(@PathVariable String userId) {
        return learningJourneyService.getLearningJourneyByUserId(userId);
    }

    @PutMapping("/entry/{entryTitle}")
    public LearningJourney updateLearningEntry(@PathVariable String entryTitle,
                                              @RequestBody LearningEntry updatedEntry,
                                              Authentication authentication) {
        String userId = authentication.getName();
        return learningJourneyService.updateLearningEntry(userId, entryTitle, updatedEntry)
                .orElseThrow(() -> new RuntimeException("Unauthorized or learning journey entry not found"));
    }

    @DeleteMapping("/entry/{entryTitle}")
    public String deleteLearningEntry(@PathVariable String entryTitle, Authentication authentication) {
        String userId = authentication.getName();
        boolean deleted = learningJourneyService.deleteLearningEntry(userId, entryTitle);
        if (deleted) {
            return "Learning journey entry deleted successfully";
        } else {
            throw new RuntimeException("Unauthorized or learning journey entry not found");
        }
    }
}