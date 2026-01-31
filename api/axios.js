import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // কুকি পাঠানোর জন্য এটি বাধ্যতামূলক
});

// Response Interceptor: এরর হ্যান্ডলিং এবং অটো-রিফ্রেশ
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ১. হ্যান্ডেল কোল্ড স্টার্ট (Timeout Error)
    if (error.code === 'ECONNABORTED' && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn('সার্ভার চালু হতে সময় নিচ্ছে, পুনরায় চেষ্টা করা হচ্ছে...');
      return API(originalRequest);
    }

    // ২. হ্যান্ডেল টোকেন এক্সপায়ার (403 Forbidden)
    // আমরা ব্যাকএন্ড মিডলওয়্যারে 403 সেট করেছিলাম টোকেন এক্সপায়ারের জন্য
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // ব্যাকএন্ডের রিফ্রেশ রুট কল করা
        await axios.get(`${API.defaults.baseURL}/auth/refresh`, {
          withCredentials: true,
        });

        // নতুন টোকেন কুকিতে সেট হয়ে গেছে, এখন আগের রিকোয়েস্টটি আবার পাঠানো হচ্ছে
        return API(originalRequest);
      } catch (refreshError) {
        // যদি রিফ্রেশ টোকেনও এক্সপায়ার হয়ে যায়, তবে ইউজারকে লগআউট করা বা লগইন পেজে পাঠানো
        console.error('সেশন শেষ হয়ে গেছে, দয়া করে আবার লগইন করুন।');
        // window.location.href = '/login'; // প্রয়োজন হলে এটি অন করতে পারো
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
