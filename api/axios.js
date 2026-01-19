import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 15000, 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.code === 'ECONNABORTED' && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn('Retrying due to backend cold start...');
      return API(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default API;
