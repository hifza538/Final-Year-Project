// vendor-frontend/src/components/profile/StatPill.jsx

const StatPill = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex-1 min-w-[150px]">
    <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
      <Icon size={18} className="text-primary" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-sm font-bold text-gray-900 truncate">{value}</p>
    </div>
  </div>
);

export default StatPill;