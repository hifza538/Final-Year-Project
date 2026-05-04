import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../api/authapi";

/*  CONTEXT  */

// Create auth context
const AuthContext = createContext();

/*  AUTH PROVIDER  */

export const AuthProvider = ({ children }) => {
  // Store logged in user data
  const [user, setUser] = useState(null);

  // Store auth token
  const [token, setToken] = useState(null);

  // Loading state while checking auth on app startup
  const [loading, setLoading] = useState(true);

  /* Check localStorage / token when app first loads */
  
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        // If token exists, restore auth state
        if (savedToken) {
          setToken(savedToken);

          // If user exists in localStorage, restore it safely
          if (savedUser) {
            try {
              const parsedUser = JSON.parse(savedUser);
              setUser(parsedUser);
            } catch (parseError) {
              console.error("Failed to parse stored user:", parseError);
              localStorage.removeItem("user");
            }
          }

          // Optional: fetch latest profile from backend
          try {
            const res = await getProfile();
            const freshUser = res.data.user || res.data;

            setUser(freshUser);
            localStorage.setItem("user", JSON.stringify(freshUser));
          } catch (profileError) {
            console.error("Failed to fetch profile:", profileError);

            // If profile fetch fails, clear invalid auth
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setToken(null);
            setUser(null);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /*  Login function  */
  const login = (newToken, userData) => {
    // Save auth info in localStorage
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));

    // Update state
    setToken(newToken);
    setUser(userData);
  };

  
  /*  Logout function  */
  
  const logout = () => {
    // Remove auth info from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear state
    setToken(null);
    setUser(null);
  };

  // Boolean to check whether user is authenticated
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
        loading,
        setUser,
      }}
    >
      {/* Render app only after auth check is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

/*  CUSTOM HOOK  */

// Easy hook for consuming auth context
export const useAuth = () => useContext(AuthContext);