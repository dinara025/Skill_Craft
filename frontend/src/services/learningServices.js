import axios from 'axios';
import { getAuthHeaders } from './authService';

const API_BASE = 'http://localhost:8080/api/learning-plans';

// Fetch plans by user
export const fetchPlansByUser = (userId) =>
  axios.get(`${API_BASE}/user/${userId}`, getAuthHeaders());


// Fetch all plans
export const fetchAllPlans = () =>
  axios.get(API_BASE, getAuthHeaders());


// Create a new plan
export const createPlan = (planData) =>
  axios.post(API_BASE, planData, {
    ...getAuthHeaders(),
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'application/json',
    },
  });


// Update a plan
export const updatePlan = (planId, planData) =>
  axios.put(`${API_BASE}/${planId}`, planData, {
    ...getAuthHeaders(),
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'application/json',
    },
  });


// Delete a plan
export const deletePlan = (planId) =>
  axios.delete(`${API_BASE}/${planId}`, getAuthHeaders());
