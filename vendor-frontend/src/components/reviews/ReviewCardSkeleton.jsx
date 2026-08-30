// vendor-frontend/src/components/reviews/ReviewCardSkeleton.jsx

const ReviewCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
    <div className="flex items-center justify-between mb-2">
      <div className="h-4 bg-gray-200 rounded w-24" />
      <div className="h-3 bg-gray-100 rounded w-16" />
    </div>
    <div className="h-3 bg-gray-100 rounded w-20 mb-2" />
    <div className="h-3 bg-gray-100 rounded w-full" />
  </div>
);

export default ReviewCardSkeleton;