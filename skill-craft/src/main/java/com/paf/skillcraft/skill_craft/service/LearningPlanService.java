package com.paf.skillcraft.skill_craft.service;

import com.paf.skillcraft.skill_craft.model.LearningPlan;
import com.paf.skillcraft.skill_craft.repository.LearningPlanRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LearningPlanService {
    private final LearningPlanRepository repository;

    public LearningPlanService(LearningPlanRepository repository) {
        this.repository = repository;
    }

    public List<LearningPlan> getAll() {
        return repository.findAll();
    }

    public List<LearningPlan> getByUser(String userId) {
        return repository.findByUserId(userId);
    }

    public Optional<LearningPlan> getById(String id) {
        return repository.findById(id);
    }

    public LearningPlan create(LearningPlan plan) {
        return repository.save(plan);
    }

    public LearningPlan update(String id, LearningPlan updatedPlan) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setTitle(updatedPlan.getTitle());
                    existing.setDescription(updatedPlan.getDescription());
                    existing.setTopics(updatedPlan.getTopics());
                    existing.setResources(updatedPlan.getResources());
                    existing.setTargetCompletionDate(updatedPlan.getTargetCompletionDate());
                    existing.setCompleted(updatedPlan.isCompleted());
                    return repository.save(existing);
                }).orElse(null);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }
}
