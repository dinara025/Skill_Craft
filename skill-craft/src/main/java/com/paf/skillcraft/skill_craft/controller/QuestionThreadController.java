package com.paf.skillcraft.skill_craft.controller;

import com.paf.skillcraft.skill_craft.model.QuestionThread;
import com.paf.skillcraft.skill_craft.service.QuestionThreadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/threads")
@CrossOrigin(origins = "*")
public class QuestionThreadController {

    @Autowired
    private QuestionThreadService threadService;

    @GetMapping
    public List<QuestionThread> getAllThreads() {
        return threadService.getAllThreads();
    }

    @GetMapping("/{id}")
    public Optional<QuestionThread> getThreadById(@PathVariable String id) {
        return threadService.getThreadById(id);
    }

    @PostMapping
    public QuestionThread createThread(@RequestBody QuestionThread thread) {
        return threadService.createThread(thread);
    }

    @PostMapping("/{id}/close")
    public void closeThread(@PathVariable String id) {
        threadService.closeThread(id);
    }

    @GetMapping("/search")
    public List<QuestionThread> searchByTags(@RequestParam List<String> tags) {
        return threadService.searchThreadsByTags(tags);
    }
}
