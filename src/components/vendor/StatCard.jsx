import React from "react";

const StatCard = ({ label, value, icon, iconBg }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;