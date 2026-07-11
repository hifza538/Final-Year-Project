// customer-frontend/src/components/layout/Layout.jsx

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

// This is a layout component that wraps all pages with a Navbar and Footer
const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;