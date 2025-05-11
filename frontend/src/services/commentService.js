// commentService.js
import axios from 'axios';
import { getAuthHeaders } from './authService'; // Assumes it returns { headers: { Authorization: 'Bearer <token>' } }

const COMMENT_API_BASE = 'http://localhost:8080/api/auth/comments';

// 🔹 Create a new comment
export const createComment = (commentData) =>
  axios.post(COMMENT_API_BASE, commentData, {
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'application/json',
    },
  });

// 🔹 Get all comments for a specific post
export const fetchCommentsByPostId = (postId) =>
  axios.get(`${COMMENT_API_BASE}/post/${postId}`, {
    headers: getAuthHeaders().headers,
  });

// 🔹 Update a comment (requires query params: userId & newContent)
export const updateComment = (commentId, userId, newContent) =>
  axios.put(`${COMMENT_API_BASE}/${commentId}`, null, {
    params: { userId, newContent },
    headers: getAuthHeaders().headers,
  });

// 🔹 Delete a comment (requires query params: requesterId & postOwnerId)
export const deleteComment = (commentId, requesterId, postOwnerId) =>
  axios.delete(`${COMMENT_API_BASE}/${commentId}`, {
    params: { requesterId, postOwnerId },
    headers: getAuthHeaders().headers,
  });
