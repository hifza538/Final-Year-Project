import React from "react";

const NavBar = () => {
  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-white shadow">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="bg-orange-500 text-white px-2 py-1 rounded">🍴</div>
        <h1 className="text-xl font-bold text-orange-600">HAT FOODIFY</h1>
      </div>

      {/* Links */}
      <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
        <li className="hover:text-orange-500 cursor-pointer">Home</li>
        <li>Restaurants</li>
        <li>Contact</li>
        <li>Dashboard</li>
      </ul>

      {/* Right */}
      <div className="flex items-center gap-4">
        <span>🛒</span>
        <button className="text-red-500 text-sm">Login</button>
      </div>
    </nav>
  );
};

export default NavBar;