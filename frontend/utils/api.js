import axios from 'axios';
import { getAuthToken } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:3000', // <-- TO'G'RILANDI
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    // Endi har bir so'rovga "/api" qo'shilmaydi,
    // shuning uchun to'liq yo'lni chaqirganimizda to'g'ri ishlaydi.
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;