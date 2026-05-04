import React from "react";
import { Check, X } from "lucide-react";

const steps = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
];

function OrderTrackingTimeline({ currentStatus }) {
  const currentIndex = steps.indexOf(currentStatus);
  const isCancelled = currentStatus === "Cancelled";

  if (isCancelled) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Order Tracking
        </h2>

        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500">
            <X className="h-5 w-5" />
          </div>

          <div>
            <p className="font-semibold text-red-600">Order Cancelled</p>
            <p className="text-sm text-slate-500">
              This order has been cancelled.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-5">
        Order Tracking
      </h2>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <div key={step} className="flex items-start gap-3">
              {/* Icon + line */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${
                    isCompleted
                      ? "border-orange-500 bg-orange-500 text-white"
                      : isCurrent
                      ? "border-orange-500 bg-orange-50 text-orange-500"
                      : "border-slate-300 bg-white text-slate-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        isCurrent ? "bg-orange-500" : "bg-slate-300"
                      }`}
                    />
                  )}
                </div>

                {index !== steps.length - 1 && (
                  <div
                    className={`mt-1 h-8 w-0.5 ${
                      index < currentIndex ? "bg-orange-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>

              {/* Text */}
              <div className="pt-1">
                <p
                  className={`text-sm font-semibold ${
                    isCompleted || isCurrent
                      ? "text-slate-900"
                      : "text-slate-400"
                  }`}
                >
                  {step}
                </p>

                {isCurrent && (
                  <p className="mt-1 text-xs font-medium text-orange-500">
                    Current status
                  </p>
                )}

                {isCompleted && (
                  <p className="mt-1 text-xs text-slate-400">Completed</p>
                )}

                {isUpcoming && (
                  <p className="mt-1 text-xs text-slate-300">Pending</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderTrackingTimeline;