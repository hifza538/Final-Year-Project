// customer-frontend/src/components/common/Logo.jsx

import { UtensilsCrossed } from "lucide-react";

const Logo = ({ size = "md", showTagline = false, variant = "dark", layout = "row" }) => {
  const sizeStyles = {
    sm: { icon: 14, badge: "p-1", text: "text-lg" },
    md: { icon: 18, badge: "p-1.5", text: "text-xl" },
    lg: { icon: 22, badge: "p-2", text: "text-2xl" },
  };
  const { icon, badge, text } = sizeStyles[size];

  const secondaryTextColor = variant === "light" ? "text-white" : "text-gray-900";
  const wrapperClass = layout === "column" ? "flex flex-col items-center gap-1.5" : "flex flex-col gap-1.5";

  return (
    <div className={wrapperClass}>
      <div className="flex items-center gap-2">
        <div className={`bg-primary ${badge} rounded-lg shrink-0`}>
          <UtensilsCrossed size={icon} className="text-white" />
        </div>
        <div className="flex items-center gap-1">
          <span className={`${text} font-bold text-primary`}>Local</span>
          <span className={`${text} font-bold ${secondaryTextColor}`}>Bites</span>
        </div>
      </div>

      {showTagline && (
        <p className={`text-xs text-gray-400 ${layout === "column" ? "text-center" : ""}`}>
          Local food, delivered fresh
        </p>
      )}
    </div>
  );
};

export default Logo;