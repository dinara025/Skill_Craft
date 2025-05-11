package com.paf.skillcraft.skill_craft.controller;

import com.paf.skillcraft.skill_craft.model.Message;
import com.paf.skillcraft.skill_craft.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping("/{threadId}")
    public List<Message> getMessagesByThread(@PathVariable String threadId) {
        return messageService.getMessagesForThread(threadId);
    }

    @PostMapping
    public Message postMessage(@RequestBody Message message) {
        return messageService.postMessage(message);
    }
}
