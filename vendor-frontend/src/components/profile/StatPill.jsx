// vendor-frontend/src/components/profile/StatPill.jsx

const StatPill = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-2.5 px-4 py-3.5 flex-1 min-w-fit">
    <Icon size={18} className="text-gray-400 flex-shrink-0" />
    <div className="min-w-0">
      <p className="text-xs text-gray-400 font-medium whitespace-nowrap">{label}</p>
      <p className="text-sm font-bold text-gray-900 whitespace-nowrap">{value}</p>
    </div>
  </div>
);

export default StatPill;