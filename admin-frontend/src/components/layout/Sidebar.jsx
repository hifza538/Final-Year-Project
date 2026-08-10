// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  Bike,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isMobileOpen, onMobileClose, isCollapsed, onToggleCollapse, pendingCounts }) => {
  const { user, logout } = useAuth();

  // Badge counts are optional and come from real stats data - only show them if the API call succeeds and returns a number greater than 0.
  const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/vendors", label: "Vendors", icon: Store, badge: pendingCounts?.vendors },
    { to: "/delivery-approvals", label: "Delivery Approvals", icon: Bike, badge: pendingCounts?.riders },
    { to: "/users", label: "Users", icon: Users },
  ];

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onMobileClose} />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-secondary flex flex-col z-30
        transform transition-all duration-200
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${isCollapsed ? "lg:w-20" : "lg:w-64"} w-64`}  
      >
        <div className="flex items-center justify-between px-5 py-6 border-b border-white/5">
          {!isCollapsed && (
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-primary">Local</span>
              <span className="text-lg font-bold text-white">Bites</span>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex text-gray-400 hover:text-white"
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onMobileClose}
              title={isCollapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isCollapsed ? "justify-center" : "justify-between"}
                ${isActive ? "bg-primary text-white" : "text-gray-300 hover:bg-white/5 hover:text-white"}`
              }
            >
              <span className="flex items-center gap-3">
                <Icon size={18} />
                {!isCollapsed && label}
              </span>
              {!isCollapsed && badge > 0 && (
                <span className="bg-white/20 text-white text-[11px] font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom profile section - fills the previously empty space and
            gives quick access to logout without leaving the sidebar */}
        <div className="border-t border-white/5 px-3 py-4">
          <div className={`flex items-center gap-2.5 px-2 mb-2 ${isCollapsed ? "justify-center" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold shrink-0">
              {user?.fullName?.charAt(0).toUpperCase() || "A"}
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
                <p className="text-xs text-gray-500 truncate">Administrator</p>
              </div>
            )}
          </div>

          <button
            onClick={logout}
            title={isCollapsed ? "Logout" : undefined}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium w-full
              text-gray-300 hover:bg-white/5 hover:text-white transition-colors
              ${isCollapsed ? "justify-center" : ""}`}
          >
            <LogOut size={16} />
            {!isCollapsed && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;