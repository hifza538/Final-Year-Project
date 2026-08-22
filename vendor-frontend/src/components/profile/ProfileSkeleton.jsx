// vendor-frontend/src/components/profile/ProfileSkeleton.jsx

const ProfileSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-pulse space-y-4">
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-5" />
    {Array(3).fill(0).map((_, i) => (
      <div key={i} className="flex items-start gap-3">
        <div className="w-8 h-8 bg-gray-100 rounded-lg" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 bg-gray-100 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export default ProfileSkeleton;