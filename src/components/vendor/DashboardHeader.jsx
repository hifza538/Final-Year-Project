import React from "react";
import { Bell, ChevronDown } from "lucide-react";

const DashboardHeader = () => {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-extrabold text-orange-500">
            StreetBite
          </span>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {["Dashboard", "Orders", "Menu", "Analytics"].map((item) => (
              <button
                key={item}
                className={
                  item === "Dashboard"
                    ? "text-orange-600 border-b-2 border-orange-500"
                    : "text-gray-500"
                }
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <button className="relative text-gray-600">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold">
              VN
            </div>
            <div className="text-sm leading-tight">
              <p className="font-semibold text-gray-800">Vendor Name</p>
              <p className="text-xs text-gray-500">vendor@streetbite.com</p>
            </div>
            <ChevronDown size={16} className="text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;