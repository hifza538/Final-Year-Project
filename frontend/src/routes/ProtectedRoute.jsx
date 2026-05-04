import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* PROTECTED ROUTE  */
// This component protects routes that require authentication
// It can also check user role if requiredRole is passed

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loader while auth state is being checked
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required and user doesn't have it, redirect home
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the protected page
  return children;
};

export default ProtectedRoute;