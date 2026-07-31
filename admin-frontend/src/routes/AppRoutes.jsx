// admin-frontend/src/routes/AppRoutes.jsx

import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          // Private route for dashboard
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      // Public route for login
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
