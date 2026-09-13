// customer-frontend/src/components/layout/AuthLayout.jsx
 
import { Clock, MapPin, UtensilsCrossed } from "lucide-react";
import Logo from "../common/Logo";
 
/* Two-sided layout for Login/Signup
left panel is branding and feature list,
right panel holds the form*/
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:hidden flex items-center justify-center py-8 bg-primary-light">
        <Logo size="md" variant="dark" layout="column" showTagline />
      </div>
      {/* Left panel - hidden on mobile, shown from md breakpoint up */}
      <div className="hidden md:flex md:w-1/2 bg-primary-light text-secondary flex-col p-12 relative overflow-hidden">
 
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-1">
          <span className="text-2xl font-bold text-primary">Local</span>
          <span className="text-2xl font-bold text-secondary">Bites</span>
        </div>
 
        <div className="relative z-10 flex-1 flex flex-col justify-top mt-16">
          <h2 className="text-4xl font-bold leading-tight mb-4 text-secondary">
            Delicious food,
            <br />
            delivered to your door.
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-md">
            Order from your favorite local restaurants and track your delivery
            in real time.
          </p>
 
          {/* Feature list*/}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/60 p-2 rounded-lg shrink-0">
                <UtensilsCrossed size={20} className="text-primary" />
              </div>
              <span className="text-gray-700">
                Local restaurants across Gujranwala
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/60 p-2 rounded-lg shrink-0">
                <Clock size={20} className="text-primary" />
              </div>
              <span className="text-gray-700">
                Fast delivery straight to your door
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/60 p-2 rounded-lg shrink-0">
                <MapPin size={20} className="text-primary" />
              </div>
              <span className="text-gray-700">
                Live order tracking from kitchen to door
              </span>
            </div>
          </div>
        </div>
 
        {/* Copyright */}
        <div className="relative z-10 text-sm text-gray-500">
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