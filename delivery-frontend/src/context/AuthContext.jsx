// delivery-frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

// this function checks if the token is valid (not expired)
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
    const savedUser = localStorage.getItem("deliveryUser");
    const savedToken = localStorage.getItem("deliveryToken");

    if (savedToken && isTokenValid(savedToken)) {
      return savedUser ? JSON.parse(savedUser) : null;
    }

    localStorage.removeItem("deliveryUser");
    localStorage.removeItem("deliveryToken");
    return null;
  });

  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("deliveryToken");
    return savedToken && isTokenValid(savedToken) ? savedToken : null;
  });

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("deliveryUser", JSON.stringify(userData));
    localStorage.setItem("deliveryToken", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("deliveryUser");
    localStorage.removeItem("deliveryToken");
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
