import axios from 'axios';
import { getAuthHeaders } from './authService';  // ✅ NEW: Import to get JWT header

const API_BASE = 'http://localhost:8080/api/follow';

// Send a new follow request
export const sendFollowRequest = (senderId, receiverId) =>
  axios.post(`${API_BASE}/send`, null, {
    params: { senderId, receiverId },
    ...getAuthHeaders()  // ✅ NEW: Attach JWT token
  });

// Get all sent follow requests by sender
export const getSentRequests = (senderId) =>
  axios.get(`${API_BASE}/sent/${senderId}`, getAuthHeaders());  // ✅ NEW: Attach JWT

// Get all received follow requests by receiver
export const getReceivedRequests = (receiverId) =>
  axios.get(`${API_BASE}/received/${receiverId}`, getAuthHeaders());  // ✅ NEW

// Update the status (accepted, declined, unfollow)
export const updateRequestStatus = (id, status) =>
  axios.put(`${API_BASE}/${id}/status`, null, {
    params: { status },
    ...getAuthHeaders()  // ✅ NEW
  });

// Delete a follow request by ID (e.g. cancel)
export const deleteRequest = (id) =>
  axios.delete(`${API_BASE}/${id}`, getAuthHeaders());  // ✅ NEW
