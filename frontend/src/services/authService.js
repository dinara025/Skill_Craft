import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/auth';  // ✅ Updated to /api/auth

export const registerUser = (username, password) =>
  axios.post(`${API_BASE}/register`, null, {
    params: { username, password }
  });

export const loginUser = (username, password) =>
  axios.post(`${API_BASE}/login`, null, {
    params: { username, password }
  });

export const getAllUsers = () => axios.get(`${API_BASE}/all`);

// ✅ Helper: Get JWT header for authenticated requests
export const getAuthHeaders = () => {
    const token = localStorage.getItem('jwtToken');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};
