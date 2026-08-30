// vendor-frontend/src/components/profile/Field.jsx

const Field = ({ label, value, icon: Icon }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon size={14} className="text-gray-500" />
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-sm text-gray-800 font-medium mt-0.5">
        {value || <span className="text-gray-300 italic">Not set</span>}
      </p>
    </div>
  </div>
);

export default Field;