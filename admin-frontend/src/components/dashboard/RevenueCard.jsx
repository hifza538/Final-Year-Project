// src/components/dashboard/RevenueSummary.jsx
const RevenueSummary = ({ isLoading }) => {
  const rows = [
    { label: "Today", available: false },
    { label: "This Week", available: false },
    { label: "This Month", available: false },
  ];

  // If the Orders feature isn't ready, show "coming soon" instead of fabricated numbers
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-secondary mb-4">Revenue Breakdown</h3>
      <div className="grid grid-cols-3 divide-x divide-gray-100">
        {rows.map((row) => (
          <div key={row.label} className="text-center px-2">
            <p className="text-xs text-gray-400 mb-1">{row.label}</p>
            {isLoading ? (
              <div className="h-5 w-14 bg-gray-100 rounded animate-pulse mx-auto" />
            ) : (
              <p className="text-sm font-semibold text-gray-300">Coming soon</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueSummary;