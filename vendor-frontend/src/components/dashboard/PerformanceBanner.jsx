// vendor-frontend/src/components/dashboard/PerformanceBanner.jsx
import { AlertTriangle } from "lucide-react";

// Performance warning banner shown to vendors when their order performance is poor
const PerformanceBanner = ({ performance }) => {
  if (!performance?.showWarning) return null;

  const {
    atRisk,
    cancellationRate,
    periodDays,
    timedOut,
    rejectedByVendor,
    acceptTimeoutMinutes,
    latestWarning,
  } = performance;

  return (
    <div
      className={`rounded-xl border p-4 sm:p-5 flex gap-3 ${
        atRisk ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
      }`}
      role="alert"
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          atRisk ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"
        }`}
      >
        <AlertTriangle size={20} />
      </div>

      <div className="text-sm">
        <h3 className={`font-semibold text-base ${atRisk ? "text-red-700" : "text-amber-800"}`}>
          {atRisk
            ? "Your account is at risk due to low performance"
            : "You have a warning from LocalBites"}
        </h3>

        {atRisk && (
          <p className="text-gray-700 mt-1">
            {cancellationRate}% of your orders in the last {periodDays} days were cancelled:{" "}
            {timedOut} not accepted in time and {rejectedByVendor} rejected by you.
          </p>
        )}

        {latestWarning?.message && (
          <p className="text-gray-700 mt-2 bg-white/70 rounded-lg p-2.5">
            <span className="font-medium">Message from LocalBites:</span> {latestWarning.message}
          </p>
        )}

        <p className="text-gray-600 mt-2">
          Please accept new orders within {acceptTimeoutMinutes} minutes.
          {atRisk && " If this continues, your account may be deactivated."}
        </p>
      </div>
    </div>
  );
};

export default PerformanceBanner;