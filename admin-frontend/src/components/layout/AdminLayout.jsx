// src/components/layout/AdminLayout.jsx
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { getOverviewStats } from "../../services/statsService";

const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pendingCounts, setPendingCounts] = useState({});
  
// Fetch pending vendor/rider counts for sidebar badges. Fail silently if the API call fails.
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const data = await getOverviewStats();
        setPendingCounts({
          vendors: data.stats.pendingVendors,
          riders: data.stats.pendingRiders,
        });
      } catch {
        // Badges are a nice-to-have - fail silently
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        pendingCounts={pendingCounts}
      />

      {/* Margin-left matches the sidebar's current width so content
          never sits underneath the fixed sidebar. 0 on mobile since
          the sidebar overlays instead of pushing content there. */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-200
          ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}`}
      >
        <Navbar onMenuClick={() => setIsMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;