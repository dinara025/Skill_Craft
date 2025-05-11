package com.paf.skillcraft.skill_craft.service;

import com.paf.skillcraft.skill_craft.model.Message;
import com.paf.skillcraft.skill_craft.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public List<Message> getMessagesForThread(String threadId) {
        return messageRepository.findByThreadIdOrderByTimestampAsc(threadId);
    }

    public Message postMessage(Message message) {
        return messageRepository.save(message);
    }
}
