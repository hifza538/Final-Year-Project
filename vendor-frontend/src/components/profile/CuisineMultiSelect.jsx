// vendor-frontend/src/components/profile/CuisineMultiSelect.jsx

import { useEffect, useState } from "react";
import api from "../../services/api";

const CuisineMultiSelect = ({ value = [], onChange }) => {
  const [cuisines, setCuisines] = useState([]);

  useEffect(() => {
    api.get("/cuisines").then((r) => setCuisines(r.data.cuisines));
  }, []);

  const toggle = (id) =>
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);

  return (
    <div className="flex flex-wrap gap-2">
      {cuisines.map((c) => (
        <button
          key={c._id}
          type="button"
          onClick={() => toggle(c._id)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            value.includes(c._id)
              ? "bg-primary-light border-primary text-primary"
              : "bg-white border-gray-200 text-gray-600 hover:border-primary/40"
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
};

export default CuisineMultiSelect;