// vendor-frontend/src/components/layout/DashboardLayout.jsx

import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <div className="relative h-full">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute top-4 -right-10 text-white bg-black/30 rounded-full p-1.5 z-10"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
              <Sidebar onNavigate={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;