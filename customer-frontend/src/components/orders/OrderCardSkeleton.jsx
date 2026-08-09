// customer-frontend/src/components/orders/OrderCardSkeleton.jsx

const OrderCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/3 mt-2" />
        </div>
      </div>
    </div>
  );
};

export default OrderCardSkeleton;