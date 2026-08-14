// customer-frontend/src/components/common/EmptyState.jsx

import { SearchX } from "lucide-react";

// Reusable empty state - used when a list has no results (restaurants, orders, etc.)
const EmptyState = ({ title = "Nothing here yet", message = "" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <SearchX size={28} className="text-gray-400" />
      </div>
      <h3 className="text-gray-700 font-semibold">{title}</h3>
      {message && <p className="text-gray-500 text-sm mt-1 max-w-sm">{message}</p>}
    </div>
  );
};

export default EmptyState;