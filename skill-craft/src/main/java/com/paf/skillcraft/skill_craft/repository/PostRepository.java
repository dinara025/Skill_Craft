package com.paf.skillcraft.skill_craft.repository;

import com.paf.skillcraft.skill_craft.model.Post;
import org.springframework.data.mongodb.repository.Aggregation;
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

    @Aggregation(pipeline = {
        "{ $match: { tags: { $regex: ?0, $options: 'i' } } }",
        "{ $unwind: '$tags' }",
        "{ $match: { tags: { $regex: ?0, $options: 'i' } } }",
        "{ $group: { _id: '$tags' } }",
        "{ $project: { _id: 0, tag: '$_id' } }",
        "{ $sort: { tag: 1 } }"
    })
    List<String> findDistinctTags(String query);
}