// src/components/restaurant/DealsSection.jsx
import React from "react";
import { BadgePercent, Ticket, Clock3 } from "lucide-react";

function DealsSection({ deals = [] }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 md:p-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
          <BadgePercent className="w-6 h-6 text-orange-500" />
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Deals & Offers
          </h2>
          <p className="text-sm text-slate-500">
            Save more with these exclusive restaurant deals
          </p>
        </div>
      </div>

      {deals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="relative overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-white p-5 hover:shadow-md transition"
            >
              {/* Badge */}
              <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Special Deal
              </div>

              <div className="pr-16">
                <h3 className="text-xl font-bold text-slate-900">
                  {deal.title}
                </h3>

                <p className="text-slate-600 text-sm md:text-base mt-2 leading-7">
                  {deal.description ||
                    "Enjoy this limited-time restaurant deal on your next order."}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="bg-slate-100 border border-dashed border-slate-300 px-3 py-2 rounded-xl text-sm font-semibold text-slate-800">
                    Code:{" "}
                    <span className="text-orange-500 font-bold">{deal.code}</span>
                  </div>

                  {deal.expiry && (
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Clock3 className="w-4 h-4" />
                      <span>{deal.expiry}</span>
                    </div>
                  )}
                </div>

                {deal.minOrder && (
                  <p className="text-xs text-slate-500 mt-3">
                    Min order: {deal.minOrder}
                  </p>
                )}

                <button className="mt-5 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl transition">
                  Apply Deal
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Empty state
        <div className="bg-slate-50 rounded-3xl py-14 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-orange-100 flex items-center justify-center mb-4">
            <Ticket className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Deals Available</h3>
          <p className="text-slate-500 mt-2">
            Check back later for exciting discounts and offers.
          </p>
        </div>
      )}
    </div>
  );
}

export default DealsSection;