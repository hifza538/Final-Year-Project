// Shown while orders are being fetched or matches OrderCard's layout
const OrderCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-2">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
        <div className="h-5 w-16 bg-gray-200 rounded-full" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-48 bg-gray-200 rounded" />
        <div className="h-3 w-32 bg-gray-200 rounded" />
        <div className="h-3 w-20 bg-gray-200 rounded" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-9 w-24 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
};

export default OrderCardSkeleton;