package com.paf.skillcraft.skill_craft.repository;

import com.paf.skillcraft.skill_craft.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostId(String postId);
}

