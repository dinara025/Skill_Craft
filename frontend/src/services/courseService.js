
// courseService.js
import axios from 'axios';
import { getAuthHeaders } from './authService'; // Reuse JWT-based auth header

const API_BASE = 'http://localhost:8080/api/auth/courses';

// Fetch all courses
export const fetchAllCourses = () =>
  axios.get(API_BASE, {
    headers: getAuthHeaders().headers,
  });

// Fetch course by ID
export const fetchCourseById = (courseId) =>
  axios.get(`${API_BASE}/${courseId}`, {
    headers: getAuthHeaders().headers,
  });

// Create a new course (Admin side)
export const createCourse = (courseData) =>
  axios.post(API_BASE, courseData, {
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'application/json',
    },
  });

// Update existing course
export const updateCourse = (courseId, updatedData) =>
  axios.put(`${API_BASE}/${courseId}`, updatedData, {
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'application/json',
    },
  });

// Delete course
export const deleteCourse = (courseId) =>
  axios.delete(`${API_BASE}/${courseId}`, {
    headers: getAuthHeaders().headers,
  });