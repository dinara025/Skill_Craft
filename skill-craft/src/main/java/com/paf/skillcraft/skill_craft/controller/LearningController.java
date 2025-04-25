package com.paf.skillcraft.skill_craft.controller;

import com.paf.skillcraft.skill_craft.model.LearningPlan;
import com.paf.skillcraft.skill_craft.service.LearningPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning-plans")
@CrossOrigin(origins = "*")
public class LearningController {

    private final LearningPlanService service;

    public LearningController(LearningPlanService service) {
        this.service = service;
    }

    @GetMapping
    public List<LearningPlan> getAll() {
        return service.getAll();
    }

    @GetMapping("/user/{userId}")
    public List<LearningPlan> getByUser(@PathVariable String userId) {
        return service.getByUser(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getById(@PathVariable String id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LearningPlan> create(@RequestBody LearningPlan plan) {
        return ResponseEntity.ok(service.create(plan));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> update(@PathVariable String id, @RequestBody LearningPlan plan) {
        LearningPlan updated = service.update(id, plan);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
