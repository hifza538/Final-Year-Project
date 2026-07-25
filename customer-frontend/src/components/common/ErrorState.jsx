// customer-frontend/src/components/common/ErrorState.jsx

import { AlertTriangle } from "lucide-react";

// Reusable error state with a retry button - used whenever a fetch fails
const ErrorState = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-red-50 p-4 rounded-full mb-4">
        <AlertTriangle size={28} className="text-red-400" />
      </div>
      <h3 className="text-gray-700 font-semibold">{message}</h3>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-full
                     hover:bg-primary-dark transition-colors duration-200"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;