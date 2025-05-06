// postService.js
import axios from 'axios';
import { getAuthHeaders } from './authService'; // ✅ Get JWT header

const API_BASE = 'http://localhost:8080/api/auth/posts';

// Fetch all posts
export const fetchAllPosts = () =>
  axios.get(API_BASE, {
    headers: getAuthHeaders().headers,
  });

// Fetch posts by a specific user
export const fetchPostsByUser = (userId) =>
  axios.get(`${API_BASE}/user/${userId}`, {
    headers: getAuthHeaders().headers,
  });

// Create a new post
export const createPost = (postData) =>
  axios.post(API_BASE, postData, {
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'application/json',
    },
  });

// Update an existing post
export const updatePost = (postId, updatedData) =>
  axios.put(`${API_BASE}/${postId}`, updatedData, {
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'application/json',
    },
  });

// Delete a post
export const deletePost = (postId) =>
  axios.delete(`${API_BASE}/${postId}`, {
    headers: getAuthHeaders().headers,
  });
