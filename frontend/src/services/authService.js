import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/user';

export const registerUser = (username, password) =>
  axios.post(`${API_BASE}/register`, null, {
    params: { username, password }
  });

export const loginUser = (username, password) =>
  axios.post(`${API_BASE}/login`, null, {
    params: { username, password }
  });

  export const getAllUsers = () => axios.get('http://localhost:8080/api/user/all');
 
