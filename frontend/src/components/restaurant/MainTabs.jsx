// src/components/restaurant/MainTabs.jsx
import React from "react";

function MainTabs({
  activeTab,
  onTabClick,
  menuCount = 0,
  reviewsCount = 0,
  dealsCount = 0,
}) {
  const tabs = [
    { key: "menu", label: "Menu", count: menuCount },
    { key: "reviews", label: "Reviews", count: reviewsCount },
    { key: "deals", label: "Deals", count: dealsCount },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-4 md:px-6">
      {/* 
        Tabs row
        - horizontally scrollable on smaller screens
      */}
      <div className="flex items-center gap-5 md:gap-8 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabClick(tab.key)}
            className={`relative py-5 text-base md:text-lg font-semibold whitespace-nowrap transition ${
              activeTab === tab.key
                ? "text-orange-500"
                : "text-slate-700 hover:text-orange-500"
            }`}
          >
            <span className="flex items-center gap-2">
              {tab.label}

              <span
                className={`min-w-[28px] h-7 px-2 rounded-full text-sm flex items-center justify-center ${
                  activeTab === tab.key
                    ? "bg-orange-50 text-orange-600"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </span>

            {/* Active underline */}
            {activeTab === tab.key && (
              <span className="absolute left-0 bottom-0 w-full h-[3px] bg-orange-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MainTabs;