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
      console.warn('সার্ভার চালু হতে সময় নিচ্ছে, পুনরায় চেষ্টা করা হচ্ছে...');
      return API(originalRequest);
    }

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.get(`${API.defaults.baseURL}/auth/refresh`, {
          withCredentials: true,
        });

        return API(originalRequest);
      } catch (refreshError) {
        console.error('সেশন শেষ হয়ে গেছে, দয়া করে আবার লগইন করুন।');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
