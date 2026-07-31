// customer-frontend/src/components/restaurant/RestaurantCardSkeleton.jsx

// Skeleton placeholder for a restaurant card - used while the restaurant list is loading
const RestaurantCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-200" />
      <div className="p-4 pt-6 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-2/3 mt-3" />
      </div>
    </div>
  );
};

export default RestaurantCardSkeleton;