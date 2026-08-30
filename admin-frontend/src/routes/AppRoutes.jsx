// admin-frontend/src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import AdminLayout from "../components/layout/AdminLayout";
import Vendors from "../pages/Vendors";
import VendorDetails from "../pages/VendorDetails";
import DeliveryRiders from "../pages/DeliveryRiders";
import RiderDetails from "../pages/RiderDetails";

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
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/vendors/:id" element={<VendorDetails />} />
        <Route path="/delivery-approvals" element={<DeliveryRiders />} />
        <Route path="/delivery-approvals/:id" element={<RiderDetails />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;