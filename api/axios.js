import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 500 || error.code === 'ECONNABORTED') &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      await new Promise((resolve) => setTimeout(resolve, 500));

      return API(originalRequest);
    }

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.get(`${API.defaults.baseURL}/api/auth/refresh`, {
          withCredentials: true,
        });
        return API(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
