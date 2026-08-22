// vendor-frontend/src/components/orders/OrderCardSkeleton.jsx

const OrderCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-3 bg-gray-100 rounded w-24" />
      </div>
      <div className="h-6 bg-gray-200 rounded-full w-20" />
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-3/4" />
    </div>
    <div className="h-9 bg-gray-200 rounded-lg" />
  </div>
);

export default OrderCardSkeleton;