import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/*  PUBLIC ROUTE  */
// This route prevents logged-in users from accessing login/signup pages

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show nothing or loader while auth is being checked
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;