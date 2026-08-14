import axios from "axios";

// Centralized axios instance - all API calls go through this
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attaches the delivery rider's token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("deliveryToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - token may have expired");
    }
    return Promise.reject(error);
  }
);

export default api;
