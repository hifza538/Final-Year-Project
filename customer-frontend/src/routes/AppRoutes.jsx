// customer-frontend/src/routes/AppRoutes.jsx

import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Cart from "../pages/Cart";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      //login/signup outside of the main layout
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      {/* Layout route - Navbar/Footer will wrap all child routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;