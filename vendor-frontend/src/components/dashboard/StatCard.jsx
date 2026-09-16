// vendor-frontend/src/components/dashboard/StatCard.jsx
 
const StatCard = ({ label, value, icon: Icon, color, sub }) => {
  const colorMap = {
    orange: { bg: "bg-primary-light", icon: "bg-primary" },
    amber: { bg: "bg-amber-50", icon: "bg-amber-500" },
    green: { bg: "bg-green-50", icon: "bg-green-500" },
    blue: { bg: "bg-blue-50", icon: "bg-blue-500" },
  };
  const c = colorMap[color] || colorMap.primary;
 
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 ${c.icon} rounded-lg flex items-center justify-center`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
    </div>
  );
};
 
export default StatCard;
 