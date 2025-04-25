// src/services/followService.js
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/follow';

// Send a new follow request
export const sendFollowRequest = (senderId, receiverId) =>
  axios.post(`${API_BASE}/send`, null, {
    params: { senderId, receiverId }
  });

// Get all sent follow requests by sender
export const getSentRequests = (senderId) =>
  axios.get(`${API_BASE}/sent/${senderId}`);

// Get all received follow requests by receiver
export const getReceivedRequests = (receiverId) =>
  axios.get(`${API_BASE}/received/${receiverId}`);

// Update the status (accepted, declined, unfollow)
export const updateRequestStatus = (id, status) =>
  axios.put(`${API_BASE}/${id}/status`, null, {
    params: { status }
  });

// Delete a follow request by ID (e.g. cancel)
export const deleteRequest = (id) =>
  axios.delete(`${API_BASE}/${id}`);
