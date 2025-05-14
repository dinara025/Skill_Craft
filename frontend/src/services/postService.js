import axios from 'axios';
import { getAuthHeaders } from './authService';

const API_BASE = 'http://localhost:8080/api/auth/posts';

export const fetchAllPosts = (currentUserId) =>
  axios.get(`${API_BASE}?currentUserId=${currentUserId}`, {
    headers: getAuthHeaders().headers,
  });

export const fetchPostsByUser = (userId) =>
  axios.get(`${API_BASE}/user/${userId}`, {
    headers: getAuthHeaders().headers,
  });

export const createPost = (postData) =>
  axios.post(API_BASE, postData, {
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'application/json',
    },
  });

export const updatePost = (postId, updatedData) =>
  axios.put(`${API_BASE}/${postId}`, updatedData, {
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'application/json',
    },
  });

export const deletePost = (postId) =>
  axios.delete(`${API_BASE}/${postId}`, {
    headers: getAuthHeaders().headers,
  });

export const likePost = (postId, userId) =>
  axios.post(`${API_BASE}/${postId}/like/${userId}`, {}, {
    headers: getAuthHeaders().headers,
  });

export const unlikePost = (postId, userId) =>
  axios.post(`${API_BASE}/${postId}/unlike/${userId}`, {}, {
    headers: getAuthHeaders().headers,
  });