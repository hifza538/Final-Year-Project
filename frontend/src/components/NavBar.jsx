import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MapPin,
  Heart,
  ShoppingCart,
  User,
  ChevronDown,
  History,
  UserCircle,
  LogOut,
} from "lucide-react";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // ✅ Har route change pe user, token, location, cart read karo
  useEffect(() => {
    // auth
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const firstName = user.fullName?.split(" ")[0] || "";
        setUserName(firstName);
      } catch {
        setUserName("");
      }
    } else {
      setUserName("");
    }

    // location
    const storedLocation = localStorage.getItem("userLocation");
    setUserLocation(storedLocation || "");

    // cart
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(Array.isArray(cart) ? cart.length : 0);
    } catch {
      setCartCount(0);
    }
  }, [location.pathname]);

  // ✅ Hero section se aane wali location ko listen karo
  useEffect(() => {
    const handleLocationChange = (e) => {
      if (e.detail) {
        setUserLocation(e.detail); // navbar ko instantly update karo
      }
    };

    window.addEventListener("userLocationChanged", handleLocationChange);
    return () => {
      window.removeEventListener("userLocationChanged", handleLocationChange);
    };
  }, []);

  // ✅ Dropdown ko outside click pe band karo
  useEffect(() => {
    if (!dropdownOpen) return;
    const close = () => setDropdownOpen(false);

    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
    setDropdownOpen(false);
    navigate("/");
  };

  const goToProfile = () => {
    setDropdownOpen(false);
    navigate("/profile");
  };

  const goToOrders = () => {
    setDropdownOpen(false);
    navigate("/orders");
  };

  const active = (path) =>
    location.pathname === path ? "text-orange-500" : "";

  // 🔹 Navbar se bhi location change karne ka simple tariqa
  const handleLocationClick = () => {
    const value = window.prompt("Enter your delivery location:");
    if (value && value.trim()) {
      const loc = value.trim();
      localStorage.setItem("userLocation", loc);
      setUserLocation(loc);

      // optional: hero ya dusre components ko bhi bata do
      window.dispatchEvent(
        new CustomEvent("userLocationChanged", { detail: loc })
      );
    }
  };

  return (
    <nav className="w-full bg-white shadow-sm px-10 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* LOGO */}
      <div className="flex items-center gap-2">
        <div className="bg-orange-500 text-white px-2 py-1 rounded">🍴</div>
        <h1 className="text-xl font-bold text-orange-600">LocalBites</h1>
      </div>

      {/* NAV LINKS */}
      <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
        <li
          className={`cursor-pointer hover:text-orange-500 ${active("/")}`}
          onClick={() => navigate("/")}
        >
          Home
        </li>

        <li
          className={`cursor-pointer hover:text-orange-500 ${active(
            "/restaurants"
          )}`}
          onClick={() => navigate("/restaurants")}
        >
          Restaurants
        </li>

        <li
          className={`cursor-pointer hover:text-orange-500 ${active(
            "/contact"
          )}`}
          onClick={() => navigate("/contact")}
        >
          Contact
        </li>

        <li
          className={`cursor-pointer hover:text-orange-500 ${active(
            "/dashboard"
          )}`}
          onClick={() => navigate("/Vendor/Dashboard")}
        >
          Dashboard
        </li>
      </ul>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6 relative">
        {/* LOCATION */}
        <div
          className="flex items-center gap-2 cursor-pointer text-sm"
          onClick={handleLocationClick}
        >
          <MapPin size={18} />
          {/* Agar location set hai to hi text dikhao */}
          {userLocation && <span>{userLocation}</span>}
        </div>

        {/* FAV */}
        {isLoggedIn && (
          <button className="hover:text-orange-600">
            <Heart size={20} />
          </button>
        )}

        {/* CART */}
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/cart")}
        >
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </div>

        {/* USER */}
        {!isLoggedIn ? (
          <button
            onClick={() => navigate("/signup")}
            className="hover:text-orange-600 flex items-center gap-1"
          >
            <User size={20} />
            <span className="text-sm font-medium">Sign up</span>
          </button>
        ) : (
          <div className="relative">
            <button
              type="button"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              onClick={(e) => {
                e.stopPropagation(); // outside click listener ko rokne ke liye
                setDropdownOpen((prev) => !prev);
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <User size={20} />
              <span className="text-sm font-medium">
                {userName || "Account"}
              </span>
              <ChevronDown size={16} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white shadow-lg rounded-xl overflow-hidden z-50">
                <button
                  onClick={goToOrders}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <History size={18} className="text-orange-500" />
                  <span>Orders &amp; reordering</span>
                </button>

                <button
                  onClick={goToProfile}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <UserCircle size={18} className="text-orange-500" />
                  <span>Profile</span>
                </button>

                <div className="border-t border-gray-100" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-gray-100"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;