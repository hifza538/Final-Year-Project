// delivery-frontend/src/components/layout/AuthLayout.jsx
import { Bike, Clock, MapPin } from "lucide-react";

// Rider-specific value props shown on the left branding panel
const features = [
  { icon: Bike, text: "Flexible hours - work when you want" },
  { icon: Clock, text: "Average payout within 24 hours" },
  { icon: MapPin, text: "Live GPS navigation for every order" },
];

// Two-panel auth layout: dark branding panel (left) + form panel (right).
// Used by both Login and Signup so the design stays consistent (DRY).
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel — hidden on mobile/tablet, visible from lg breakpoint up.
          Hidden on small screens because there's no room for branding text
          alongside a usable form; form must stay the priority on mobile. */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-secondary via-secondary to-black">
        {/* Subtle decorative glow, purely visual, no impact on content */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-1">
          <span className="text-2xl font-bold text-primary">Local</span>
          <span className="text-2xl font-bold text-white">Bites</span>
          <span className="text-sm text-gray-400 ml-1 mt-1">Rider</span>
        </div>

        {/* Heading + features */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Deliver food,
            <br /> earn on your time.
          </h1>
          <p className="text-gray-300 text-base mb-8 max-w-md">
            Join thousands of riders earning flexible income by delivering
            orders from local restaurants to happy customers.
          </p>

          <div className="space-y-4">
            {features.map(({ icon: Icon, text }, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-primary" />
                </div>
                <span className="text-gray-200 text-sm">{text}</span>
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