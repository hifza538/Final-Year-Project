// customer-frontend/src/routes/AppRoutes.jsx

import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import RestaurantDetail from "../pages/RestaurantDetail";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import OrderConfirmation from "../pages/OrderConfirmation";
import Orders from "../pages/Orders";
import Profile from "../pages/Profile";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      //login/signup outside of the main layout
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      {/* Layout route - Navbar/Footer will wrap all child routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
