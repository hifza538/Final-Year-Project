// delivery-frontend/src/components/layout/AuthLayout.jsx
import { Bike, Clock, MapPin } from "lucide-react";

// Rider-specific value props shown on the left branding panel
const features = [
  { icon: Bike, text: "Flexible hours - work when you want" },
  { icon: Clock, text: "Average payout within 24 hours" },
  { icon: MapPin, text: "Live GPS navigation for every order" },
];

// Two-panel auth layout: light branding panel (left) + form panel (right).
// Used by both Login and Signup so the design stays consistent (DRY),
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel — hidden on mobile/tablet, visible from lg breakpoint up. */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-primary-light">
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-1">
          <span className="text-2xl font-bold text-primary">Local</span>
          <span className="text-2xl font-bold text-secondary">Bites</span>
          <span className="text-sm text-gray-500 ml-1 mt-1">Rider</span>
        </div>

        {/* Heading + features */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-secondary leading-tight mb-4">
            Deliver food,
            <br /> earn on your time.
          </h1>
          <p className="text-gray-600 text-base mb-8 max-w-md">
            Join thousands of riders earning flexible income by delivering
            orders from local restaurants to happy customers.
          </p>

          <div className="space-y-4">
            {features.map(({ icon: Icon, text }, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/70 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Icon size={18} className="text-primary" />
                </div>
                <span className="text-secondary text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-gray-500 text-xs">
          © {new Date().getFullYear()} LocalBites. All rights reserved.
        </p>
      </div>

      {/* Right Panel — always visible, holds the actual form (Login/Signup) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;