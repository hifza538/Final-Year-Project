// vendor-frontend/src/components/layout/TopBar.jsx

import { useLocation } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/orders":    "Orders",
  "/menu":      "Menu Management",
  "/profile":   "Restaurant Profile",
};

const TopBar = ({ onMenuClick }) => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const title = PAGE_TITLES[pathname] || "Dashboard";

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center 
      justify-between px-6 sticky top-0 z-20">

      <div className="flex items-center gap-3">
        {/* Hamburger Menu for Mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-gray-900"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button
          title="Notifications coming soon"
          className="relative w-9 h-9 flex items-center justify-center 
            rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-primary-light flex items-center 
          justify-center text-primary-dark font-bold text-sm">
          {user?.fullName?.[0]?.toUpperCase() || "V"}
        </div>
      </div>
    </header>
  );
};

export default TopBar;