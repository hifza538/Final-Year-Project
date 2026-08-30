// src/components/layout/Navbar.jsx
import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, LogOut, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-gray-100">
      <button onClick={onMenuClick} className="lg:hidden" aria-label="Open menu">
        <Menu size={22} className="text-secondary" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">
        <button className="relative text-gray-500 hover:text-secondary transition-colors" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
              {user?.fullName?.charAt(0).toUpperCase() || "A"}
            </div>
            <span className="hidden sm:block text-sm font-medium text-secondary">
              {user?.fullName}
            </span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg border border-gray-100 shadow-lg py-1.5 z-40">
              <button
                onClick={logout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;