package com.paf.skillcraft.skill_craft.controller;

import com.paf.skillcraft.skill_craft.service.CourseService;
import com.paf.skillcraft.skill_craft.model.Course;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3001")
@RequestMapping("/api/v1/course")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @PostMapping("/add")
    public String addCourse(@RequestBody Course course) {
        courseService.saveOrUpdate(course);
        return course.getId();
    }

    @GetMapping("/all")
    private Iterable<Course> getCourses() {
        return courseService.getAllCourses();
    }

    @PutMapping("/update/{id}")
    private Course updateCourse(@RequestBody Course course, @PathVariable String id) {
        course.setId(id);
        courseService.saveOrUpdate(course);
        return course;
    }

    @DeleteMapping("/delete/{id}")
    private void deleteCourse(@PathVariable String id) {
        courseService.deleteCourse(id);
    }

    @GetMapping("/get/{id}")
    private Course getCourse(@PathVariable String id) {
        return courseService.getCourseById(id);
    }
}
