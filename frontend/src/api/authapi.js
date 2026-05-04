import API from "./axios";

/*  AUTH ENDPOINTS */

// Register a new user
export const registerUser = (userData) => {
  return API.post("/users/register", userData);
};

// Login user
export const loginUser = (userData) => {
  return API.post("/users/login", userData);
};

// Get currently logged-in user profile
export const getProfile = () => {
  return API.get("/users/me");
};

// Send OTP for forgot password
export const forgotPassword = (data) => {
  return API.post("/users/forgot-password", data);
};

// Verify OTP code
export const verifyOtp = (data) => {
  return API.post("/users/verify-otp", data);
};

// Reset password after OTP verification
export const resetPassword = (data) => {
  return API.post("/users/reset-password", data);
};