// courseService.js
import axios from "axios";
import { getAuthHeaders } from "./authService"; // returns { Authorization: `Bearer token` }

const API_BASE = "http://localhost:8080/api/auth/v1/course";

// Fetch all courses
export const fetchAllCourses = () =>
  axios.get(`${API_BASE}/all`, {
    headers: getAuthHeaders(),
  });

// Fetch course by ID
export const fetchCourseById = (courseId) =>
  axios.get(`${API_BASE}/${courseId}`, {
    headers: getAuthHeaders(),
  });

// Create a new course
export const createCourse = (courseData) =>
  axios.post(`${API_BASE}/add`, courseData, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });

// Update existing course
export const updateCourse = (courseId, updatedData) =>
  axios.put(`${API_BASE}/update/${courseId}`, updatedData, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });

// Delete course
export const deleteCourse = (courseId) =>
  axios.delete(`${API_BASE}/delete/${courseId}`, {
    headers: getAuthHeaders(),
  });
