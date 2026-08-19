// vendor-frontend/src/components/common/ErrorState.jsx

// Reusable error banner with retry — used across Menu, Orders, Profile, Dashboard
const ErrorState = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 
    text-sm px-4 py-3 rounded-lg flex items-center justify-between">
    <span>{message}</span>
    {onRetry && (
      <button
        onClick={onRetry}
        className="text-red-500 underline text-xs ml-4"
      >
        Retry
      </button>
    )}
  </div>
);

export default ErrorState;