// vendor-frontend/src/components/profile/SectionCard.jsx

// Wraps a group of Field components in a titled card
const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
      {Icon && (
        <div className="w-7 h-7 bg-primary-light rounded-lg flex items-center justify-center">
          <Icon size={14} className="text-primary" />
        </div>
      )}
      <h3 className="text-sm font-bold text-gray-800">{title}</h3>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

export default SectionCard;