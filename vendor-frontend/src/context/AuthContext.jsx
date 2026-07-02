import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

// token validation function to check if the token is expired
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
    const savedUser = localStorage.getItem("vendorUser");
    const savedToken = localStorage.getItem("vendorToken");

    // Check token validity on app load
    if (savedToken && isTokenValid(savedToken)) {
      return savedUser ? JSON.parse(savedUser) : null;
    }

    // Token expired — clear storage
    localStorage.removeItem("vendorUser");
    localStorage.removeItem("vendorToken");
    return null;
  });

  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("vendorToken");
    return savedToken && isTokenValid(savedToken) ? savedToken : null;
  });

  // login function for setting user and token in state and localStorage
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("vendorUser", JSON.stringify(userData));
    localStorage.setItem("vendorToken", authToken);
  };

  // logout function for clearing user and token from state and localStorage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("vendorUser");
    localStorage.removeItem("vendorToken");
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// custom hook for accessing the AuthContext
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};