

package com.paf.skillcraft.skill_craft.repository;

import com.paf.skillcraft.skill_craft.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;

// This interface provides CRUD methods for the Course entity
public interface CourseRepo extends MongoRepository<Course, String> 
 {
    
}
