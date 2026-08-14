// admin-frontend/src/routes/AppRoutes.jsx

import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import VendorApprovals from "../pages/VendorApprovals";
import NotFound from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import AdminLayout from "../components/layout/AdminLayout";

const AppRoutes = () => {
  return (
  
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/vendor-approvals" element={<VendorApprovals />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;