// admin-frontend/src/routes/PrivateRoute.jsx

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// private route component to protect routes that require authentication
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;

