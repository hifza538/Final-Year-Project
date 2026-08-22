// vendor-frontend/src/components/common/EmptyState.jsx

const EmptyState = ({ icon: Icon, title, message, actionLabel, onAction }) => (
  <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
    {Icon && (
      <div className="w-14 h-14 bg-primary-light rounded-full flex items-center 
        justify-center mx-auto mb-4">
        <Icon size={24} className="text-primary" />
      </div>
    )}
    <h3 className="text-gray-800 font-semibold mb-1">{title}</h3>
    {message && (
      <p className="text-gray-400 text-sm max-w-xs mx-auto mb-4">{message}</p>
    )}
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="inline-flex items-center gap-2 bg-primary 
          hover:bg-primary-dark text-white text-sm font-semibold 
          px-4 py-2 rounded-lg transition-colors"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;