package com.paf.skillcraft.skill_craft.service;

import com.paf.skillcraft.skill_craft.model.QuestionThread;
import com.paf.skillcraft.skill_craft.repository.QuestionThreadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionThreadService {

    @Autowired
    private QuestionThreadRepository questionThreadRepository;

    public List<QuestionThread> getAllThreads() {
        return questionThreadRepository.findAll();
    }

    public Optional<QuestionThread> getThreadById(String id) {
        return questionThreadRepository.findById(id);
    }

    public List<QuestionThread> searchThreadsByTags(List<String> tags) {
        return questionThreadRepository.findByTagsIn(tags);
    }

    public QuestionThread createThread(QuestionThread thread) {
        return questionThreadRepository.save(thread);
    }

    public void closeThread(String id) {
        questionThreadRepository.findById(id).ifPresent(thread -> {
            thread.setStatus("resolved");
            questionThreadRepository.save(thread);
        });
    }
}
