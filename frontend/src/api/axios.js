import axios from "axios";

/* AXIOS INSTANCE */

// Create a reusable axios instance for API requests
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/*  REQUEST INTERCEPTOR */
// This interceptor runs before every request
// It attaches the token from localStorage to Authorization header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // If token exists, attach it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*  RESPONSE INTERCEPTOr*/
// This interceptor handles global API errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || "";

    // Logout user only for protected auth failures
    // Avoid redirecting for forgot-password / otp / reset-password routes
    const isAuthFlowRoute =
      requestUrl.includes("/users/login") ||
      requestUrl.includes("/users/register") ||
      requestUrl.includes("/users/forgot-password") ||
      requestUrl.includes("/users/verify-otp") ||
      requestUrl.includes("/users/reset-password");

    if (status === 401 && !isAuthFlowRoute) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login page
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;