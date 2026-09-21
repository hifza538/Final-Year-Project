import api from "./api";

export const registerDelivery = async (formData) => {
  const payload = { ...formData };
  delete payload.confirmPassword;

  const response = await api.post("/delivery/register", payload);
  return response.data;
};

export const loginDelivery = async (formData) => {
  const response = await api.post("/delivery/login", formData);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/delivery/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.post(`/delivery/reset-password/${token}`, { password });
  return response.data;
};

// Verifies the account using the token from the verification email
export const verifyEmail = async (token) => {
  const response = await api.post(`/delivery/verify-email/${token}`);
  return response.data;
};
 
// Requests a new verification email (in case the first one was missed or expired)
export const resendVerification = async (email) => {
  const response = await api.post("/delivery/resend-verification", { email });
  return response.data;
};