// customer-frontend/src/components/home/CuisineFilterChips.jsx

import { useEffect, useState } from "react";
import api from "../../services/api";

const CuisineFilterChips = ({ value, onChange }) => {
  const [cuisines, setCuisines] = useState([]);

  useEffect(() => {
    api.get("/cuisines").then((r) => setCuisines(r.data.cuisines));
  }, []);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => onChange("All")}
        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
          value === "All" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        All
      </button>
      {cuisines.map((c) => (
        <button
          key={c._id}
          onClick={() => onChange(c.name)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            value === c.name ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
};

export default CuisineFilterChips;