// src/components/dashboard/StatCard.jsx
import { TrendingUp, TrendingDown } from "lucide-react";

// Compact card showing a single stat (e.g., total customers, total vendors, etc.) with an icon and optional trend indicator. 
// Accepts `isLoading` to show a skeleton state while data is being fetched.
const StatCard = ({ icon: Icon, label, value, gradient, trend, isLoading }) => {
  return (
    <div
      className="relative overflow-hidden rounded-xl p-6 shadow-sm hover:shadow-md
        transition-shadow duration-200 bg-white border border-gray-100"
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -mr-8 -mt-8"
        style={{ background: gradient }}
      />

      <div className="relative flex items-center justify-between mb-4">
        <div
          className="w-11 h-11 rounded-lg flex items-center justify-center"
          style={{ background: gradient }}
        >
          <Icon size={20} className="text-white" />
        </div>

        {trend && !isLoading && (
          <span
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
              trend.direction === "up"
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {trend.direction === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend.value}%
          </span>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-1">{label}</p>
      {isLoading ? (
        <div className="h-7 w-20 bg-gray-200 rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-secondary">{value ?? "—"}</p>
      )}
    </div>
  );
};

export default StatCard;