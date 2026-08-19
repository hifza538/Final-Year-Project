// vendor-frontend/src/components/layout/AuthLayout.jsx

import { ChefHat } from "lucide-react";

// authLayout component for authentication pages (login+register)
const AuthLayout = ({ heading, subtext, children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
            <ChefHat size={22} className="text-primary" />
          </div>
          <span className="text-white font-bold text-xl">LocalBites</span>
        </div>

        <div>
          <h2 className="text-white text-4xl font-bold leading-snug mb-4">
            {heading}
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-sm">
            {subtext}
          </p>

          <div className="flex gap-3 mt-8">
            {[
              { label: "Active Vendors", value: "500+" },
              { label: "Daily Orders",   value: "2000+" },
              { label: "Cities",         value: "10+" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 rounded-xl px-4 py-3">
                <p className="text-primary font-bold text-lg">{value}</p>
                <p className="text-gray-300 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-400 text-xs">
          © {new Date().getFullYear()} LocalBites. All rights reserved.
        </p>
      </div>

      {/* Right Form Panel - passed in as children */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ChefHat size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900">LocalBites Vendor</span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;