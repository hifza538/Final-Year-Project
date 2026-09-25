// vendor-frontend/src/components/menu/CategorySelect.jsx

import { useEffect, useRef, useState } from "react";
import { Filter, ChevronDown, Check } from "lucide-react";

const CategorySelect = ({ value, onChange, categories }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const options = ["All", ...categories.map((c) => c.name)];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between gap-3 pl-4 pr-3 py-2.5
          text-sm rounded-lg border border-gray-200 bg-white
          hover:border-primary/40 transition-colors min-w-[180px]"
      >
        <span className="flex items-center gap-2 text-gray-700">
          <Filter size={14} className="text-gray-400" />
          {value === "All" ? "All Categories" : value}
        </span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-100 shadow-lg py-1.5 z-20 max-h-72 overflow-y-auto">
          {options.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => { onChange(cat); setOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2 text-sm text-left transition-colors ${
                value === cat ? "text-primary bg-primary-light font-medium" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat === "All" ? "All Categories" : cat}
              {value === cat && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
