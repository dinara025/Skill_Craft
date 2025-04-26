package com.paf.skillcraft.skill_craft.service;

import com.paf.skillcraft.skill_craft.model.Course;
import com.paf.skillcraft.skill_craft.repository.CourseRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CourseService {

    @Autowired
    private CourseRepo repo;

    public void saveOrUpdate(Course course) {
        repo.save(course);
    }

    public Iterable<Course> getAllCourses() {
        return repo.findAll();
    }

    public Course getCourseById(String id) {
        return repo.findById(id).orElse(null);
    }

    public void deleteCourse(String id) {
        repo.deleteById(id);
    }
}
