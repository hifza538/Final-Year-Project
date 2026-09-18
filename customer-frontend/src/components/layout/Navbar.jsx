// customer-frontend/src/components/layout/Navbar.jsx

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../common/Logo";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  MapPin,
  Bell,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useLocation } from "../../context/LocationContext";
import { useNotifications } from "../../context/NotificationContext";
import LocationPickerModal from "../common/LocationPickerModal";

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
        className="relative flex items-center justify-center w-10 h-10 rounded-full
                   text-gray-700 hover:bg-primary-light hover:text-primary transition-colors duration-200"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 bg-primary text-white text-[10px]
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

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const dropdownRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { coordinates, locationLabel, setLocation } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };
  // Close dropdown when clicking anywhere outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const locationText = coordinates ? (locationLabel || "Location set") : "Set delivery location";

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <Logo size="md" variant="dark" />
          </Link>

          {/* Location button — desktop only */}
          <button
            onClick={() => setShowLocationModal(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium
                       text-gray-700 hover:bg-primary-light hover:text-primary transition-colors duration-200
                       shrink-0 max-w-[220px]"
          >
            <MapPin size={16} className={coordinates ? "text-primary shrink-0" : "shrink-0"} />
            <span className="truncate">{locationText}</span>
          </button>

          {/* Right side icons — desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/cart"
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-full
                         text-gray-700 hover:bg-primary-light hover:text-primary
                         transition-colors duration-200"
            >
              <ShoppingCart size={20} />
              <span className="text-sm font-medium">Cart</span>
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-primary text-white text-xs
                                 font-bold rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              // Profile dropdown — replaces the old plain name + separate logout button
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full
                             text-gray-700 hover:bg-primary-light hover:text-primary
                             transition-colors duration-200"
                >
                  <User size={20} />
                  <span className="text-sm font-medium">
                    {user?.fullName?.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${profileDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg
                               border border-gray-100 py-2 z-50"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700
                                 hover:bg-primary-light hover:text-primary transition-colors"
                    >
                      <User size={16} />
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700
                                 hover:bg-primary-light hover:text-primary transition-colors"
                    >
                      <Package size={16} />
                      My Orders
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500
                                 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-full
                           hover:bg-primary-dark transition-colors duration-200"
              >
                Login
              </Link>
            )}

            {isAuthenticated && <NotificationBell />}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <button
            onClick={() => setShowLocationModal(true)}
            className="w-full flex items-center gap-2 px-2 py-2 text-gray-700"
          >
            <MapPin size={18} className={coordinates ? "text-primary" : ""} />
            {coordinates ? "Location set" : "Set delivery location"}
          </button>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search for restaurants or dishes..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-2 py-2 text-gray-700"
          >
            <ShoppingCart size={20} />
            Cart {cartCount > 0 && `(${cartCount})`}
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-2 py-2 text-gray-700"
              >
                <User size={20} />
                {user?.name}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-2 py-2 text-gray-500 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center px-5 py-2 bg-primary text-white font-semibold rounded-full"
            >
              Login
            </Link>
          )}
        </div>
      )}

      {showLocationModal && (
        <LocationPickerModal
          onClose={() => setShowLocationModal(false)}
          onConfirm={setLocation}
        />
      )}
    </nav>
  );
};

export default Navbar;