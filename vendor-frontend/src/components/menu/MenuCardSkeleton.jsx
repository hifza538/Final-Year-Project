// vendor-frontend/src/components/menu/MenuCardSkeleton.jsx

const MenuCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-100 animate-pulse">
    <div className="h-40 bg-gray-200 rounded-t-xl" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/4" />
    </div>
  </div>
);

export default MenuCardSkeleton;