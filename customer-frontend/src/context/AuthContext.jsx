// customer-frontend/src/context/AuthContext.jsx

import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

// Token validation - check wheather token is expired or not
const isTokenValid = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("customerUser");
    const savedToken = localStorage.getItem("customerToken");

    // vaidate token on app load
    if (savedToken && isTokenValid(savedToken)) {
      return savedUser ? JSON.parse(savedUser) : null;
    }

    // Token expired - clear stored auth data
    localStorage.removeItem("customerUser");
    localStorage.removeItem("customerToken");
    return null;
  });

  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("customerToken");
    return savedToken && isTokenValid(savedToken) ? savedToken : null;
  });

  // store user and token in state and localStorage on login
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("customerUser", JSON.stringify(userData));
    localStorage.setItem("customerToken", authToken);
  };

  // Logout function - clear state and localStorage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("customerUser");
    localStorage.removeItem("customerToken");
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};