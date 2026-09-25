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
import Customers from "../pages/Customers";
import CustomerDetails from "../pages/CustomerDetails";
import Orders from "../pages/Orders";
import OrderDetails from "../pages/OrderDetails";
import Categories from "../pages/Categories";
import MenuCategories from "../pages/MenuCategories";
import Reports from "../pages/Reports";
import AppSettings from "../pages/AppSettings";
import Profile from "../pages/Profile";


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
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:id" element={<CustomerDetails />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/cuisines" element={<Categories />} />
        <Route path="/categories" element={<MenuCategories />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<AppSettings />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRoutes;