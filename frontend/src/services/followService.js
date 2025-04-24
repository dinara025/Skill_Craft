// src/services/followService.js
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/follow';

export const sendFollowRequest = (senderId, receiverId) =>
  axios.post(`${API_BASE}/send`, null, { params: { senderId, receiverId } });

export const getSentRequests = (senderId) =>
  axios.get(`${API_BASE}/sent/${senderId}`);

export const getReceivedRequests = (receiverId) =>
  axios.get(`${API_BASE}/received/${receiverId}`);

export const updateRequestStatus = (id, status) =>
  axios.put(`${API_BASE}/${id}/status`, null, { params: { status } });

export const deleteRequest = (id) =>
  axios.delete(`${API_BASE}/${id}`);
