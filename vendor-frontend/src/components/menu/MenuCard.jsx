// vendor-frontend/src/components/menu/MenuCard.jsx

import { Pencil, Trash2, UtensilsCrossed, ToggleLeft, ToggleRight } from "lucide-react";

const MenuCard = ({ item, onEdit, onDelete, onToggleStock }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm 
    hover:shadow-md transition-shadow overflow-hidden">

    <div className="h-40 bg-gray-100 overflow-hidden relative">
      {item.image?.url ? (
        <img
          src={item.image.url}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <UtensilsCrossed size={32} className="text-gray-300" />
        </div>
      )}

      <span className={`absolute top-2 right-2 text-xs font-semibold 
        px-2 py-0.5 rounded-full ${
          item.inStock
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}>
        {item.inStock ? "In Stock" : "Out of Stock"}
      </span>

      <span className="absolute top-2 left-2 text-xs font-semibold 
        px-2 py-0.5 rounded-full bg-white/90 text-gray-700">
        {item.category}
      </span>
    </div>

    <div className="p-4">
      <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
      {item.description && (
        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
          {item.description}
        </p>
      )}
      <p className="text-lg font-bold text-primary mt-2">
        Rs {item.price.toLocaleString()}
      </p>

      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={() => onToggleStock(item._id)}
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 
            py-1.5 rounded-lg transition-colors ${
              item.inStock
                ? "bg-green-50 text-green-600 hover:bg-green-100"
                : "bg-red-50 text-red-600 hover:bg-red-100"
            }`}
        >
          {item.inStock
            ? <ToggleRight size={14} />
            : <ToggleLeft size={14} />
          }
          {item.inStock ? "In Stock" : "Out of Stock"}
        </button>

        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => onEdit(item)}
            className="w-8 h-8 flex items-center justify-center rounded-lg 
              bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-500 
              transition-colors"
          >
            <Pencil size={14} />
          </button>

          <button
            onClick={() => onDelete(item._id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg 
              bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 
              transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default MenuCard;