// vendor-frontend/src/components/layout/TopBar.jsx

import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/orders":    "Orders",
  "/menu":      "Menu Management",
   "/reviews":   "Reviews",
  "/profile":   "Restaurant Profile",
};

// Formats a Date into a short relative time string ("2m ago", "1h ago")
const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const bellRef = useRef(null);
  const { notifications, unreadCount, markAllRead } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setOpen((prev) => !prev);
    if (!open) markAllRead();
  };

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={handleToggle}
        title="Notifications"
        className="relative w-9 h-9 flex items-center justify-center 
          rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-primary text-white text-[10px]
            font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg
                        border border-gray-100 max-h-96 overflow-y-auto z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-secondary">Notifications</h3>
          </div>
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No notifications yet</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="px-4 py-3 border-b border-gray-100 last:border-0">
                <p className="text-sm text-gray-700">{n.message}</p>
                <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.receivedAt)}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
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
        <NotificationBell />

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