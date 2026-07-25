// customer-frontend/src/components/restaurant/MenuItemSkeleton.jsx

const MenuItemSkeleton = () => {
  return (
    <div className="flex gap-4 bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
      <div className="w-20 h-20 rounded-lg bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-6 bg-gray-200 rounded w-1/3 mt-2" />
      </div>
    </div>
  );
};

export default MenuItemSkeleton;