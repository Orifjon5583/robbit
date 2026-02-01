import axios from 'axios';
import { getAuthToken } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Hardcoded for now or use env
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
