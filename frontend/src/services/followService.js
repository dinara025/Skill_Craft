import axios from "axios";
import { getAuthHeaders } from "./authService"; // ✅ Get JWT header

const API_BASE = "http://localhost:8080/api/follow";

// Send a new follow request
export const sendFollowRequest = (senderId, receiverId) =>
  axios.post(`${API_BASE}/send`, null, {
    params: { senderId, receiverId },
    headers: getAuthHeaders().headers, // ✅ Correct header usage
  });

// Get all sent follow requests by sender
export const getSentRequests = (senderId) =>
  axios.get(`${API_BASE}/sent/${senderId}`, {
    headers: getAuthHeaders().headers, // ✅ Correct header usage
  });

// Get all received follow requests by receiver
export const getReceivedRequests = (receiverId) =>
  axios.get(`${API_BASE}/received/${receiverId}`, {
    headers: getAuthHeaders().headers, // ✅ Correct header usage
  });

// Update the status (accepted, declined, unfollow)
export const updateRequestStatus = (id, status) =>
  axios.put(`${API_BASE}/${id}/status`, null, {
    params: { status },
    headers: getAuthHeaders().headers, // ✅ Correct header usage
  });

// Delete a follow request by ID (cancel/unfollow)
export const deleteRequest = (id) =>
  axios.delete(`${API_BASE}/${id}`, {
    headers: getAuthHeaders().headers, // ✅ Correct header usage
  });

export const getFollowersCount = (receiverId) =>
  axios.get(`${API_BASE}/count/followers/${receiverId}`, {
    headers: getAuthHeaders().headers,
  });

export const getFollowingCount = (senderId) =>
  axios.get(`${API_BASE}/count/following/${senderId}`, {
    headers: getAuthHeaders().headers,
  });
