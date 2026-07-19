// customer-frontend/src/components/layout/AuthLayout.jsx

import { Clock, MapPin, UtensilsCrossed } from "lucide-react";

/* Two-sided layout for Login/Signup
left panel is branding and feature list,
right panel holds the form*/
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left panel - hidden on mobile, shown from md breakpoint up */}
      <div className="hidden md:flex md:w-1/2 bg-secondary text-white flex-col p-12 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-1">
          <span className="text-2xl font-bold text-primary">Local</span>
          <span className="text-2xl font-bold text-white">Bites</span>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-top mt-16">

          <h2 className="text-4xl font-bold leading-tight mb-4">
            Delicious food,
            <br />
            delivered to your door.
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-md">
            Order from your favorite local restaurants and track your delivery in real time.
          </p>

          {/* Feature list*/}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-lg shrink-0">
                <UtensilsCrossed size={20} className="text-primary" />
              </div>
              <span className="text-gray-200">500+ restaurants across 10+ cities</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-lg shrink-0">
                <Clock size={20} className="text-primary" />
              </div>
              <span className="text-gray-200">Average delivery time of 30 minutes</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-lg shrink-0">
                <MapPin size={20} className="text-primary" />
              </div>
              <span className="text-gray-200">Live order tracking from kitchen to door</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="relative z-10 text-sm text-gray-400">
          © {new Date().getFullYear()} LocalBites. All rights reserved.
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;