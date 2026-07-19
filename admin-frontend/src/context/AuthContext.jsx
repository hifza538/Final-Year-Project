// admin-frontend/src/context/AuthContext.jsx

import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);
// token validation
const isTokenValid = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
};
// AuthProvider component to manage authentication state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("adminUser");
    const savedToken = localStorage.getItem("adminToken");

    if (savedToken && isTokenValid(savedToken)) {
      return savedUser ? JSON.parse(savedUser) : null;
    }

    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
    return null;
  });

  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("adminToken");
    return savedToken && isTokenValid(savedToken) ? savedToken : null;
  });

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("adminUser", JSON.stringify(userData));
    localStorage.setItem("adminToken", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
// AuthContext hook to access authentication state and actions
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

