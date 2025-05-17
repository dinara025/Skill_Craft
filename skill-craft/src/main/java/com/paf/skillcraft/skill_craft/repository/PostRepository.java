package com.paf.skillcraft.skill_craft.repository;

import com.paf.skillcraft.skill_craft.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUserId(String userId);
    
    // Optional: to find posts liked by a specific user
    List<Post> findByLikesContaining(String userId);
    
    // To count posts by userId
    long countByUserId(String userId);

    @Query("{ 'tags' : { $regex: ?0, $options: 'i' } }")
    List<Post> findByTagsContainingIgnoreCase(String tag);

    @Query(value = "{ 'tags' : { $regex: ?0, $options: 'i' } }", fields = "{ 'tags' : 1 }")
    List<Post> findDistinctTagsByTagContainingIgnoreCase(String query);
}