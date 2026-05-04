import Navbar from "../components/NavBar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      {/* Sticky Navbar */}
      <Navbar />

      {/* Page Content */}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
