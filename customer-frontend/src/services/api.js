// customer-frontend/src/services/api.js

import axios from "axios";

// Centralized axios instance - all apis calls wiill use this instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - automatically attches the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("customerToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handles 401 Unauthorized errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - will be wired to AuthContext.logout() in the Auth feature
      console.warn("Unauthorized — token may have expired");
    }
    return Promise.reject(error);
  }
);

export default api;