package com.paf.skillcraft.skill_craft.repository;

import com.paf.skillcraft.skill_craft.model.LearningJourney;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LearningJourneyRepository extends MongoRepository<LearningJourney, String> {
    List<LearningJourney> findByUserId(String userId);
}