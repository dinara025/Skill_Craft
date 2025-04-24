package com.paf.skillcraft.skill_craft.repository;

import com.paf.skillcraft.skill_craft.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUserId(String userId);
}
