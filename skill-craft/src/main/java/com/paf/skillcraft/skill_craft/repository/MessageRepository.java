package com.paf.skillcraft.skill_craft.repository;

import com.paf.skillcraft.skill_craft.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByThreadIdOrderByTimestampAsc(String threadId);
}
