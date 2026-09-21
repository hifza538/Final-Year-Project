// vendor-frontend/src/components/dashboard/SkeletonCard.jsx
 
const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-5 border border-gray-100 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-7 w-16 bg-gray-200 rounded" />
        <div className="h-3 w-20 bg-gray-100 rounded" />
      </div>
      <div className="w-10 h-10 bg-gray-200 rounded-lg" />
    </div>
  </div>
);
 
export default SkeletonCard;