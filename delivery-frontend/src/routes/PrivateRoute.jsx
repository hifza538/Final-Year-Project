import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// A wrapper for private routes that checks if the user is authenticated.
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
