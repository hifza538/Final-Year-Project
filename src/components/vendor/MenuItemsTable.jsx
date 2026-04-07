import React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

const MenuItemsTable = ({
  menuItems,
  onAddNewItem,
  onToggleAvailability,
  onDeleteItem,
}) => {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Menu Items</h2>

        <button
          onClick={onAddNewItem}
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
        >
          <Plus size={16} />
          <span>Add New Item</span>
        </button>
      </div>

      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 px-6 py-3 text-xs font-semibold text-gray-500">
          <div className="col-span-4">ITEM NAME</div>
          <div className="col-span-3">CATEGORY</div>
          <div className="col-span-2">PRICE</div>
          <div className="col-span-2">AVAILABILITY</div>
          <div className="col-span-1 text-right">ACTIONS</div>
        </div>

        {menuItems.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-12 items-center px-6 py-4 text-sm border-t border-gray-100"
          >
            <div className="col-span-4 font-semibold text-gray-900">{item.name}</div>
            <div className="col-span-3 text-gray-700">{item.category}</div>
            <div className="col-span-2 font-semibold text-gray-900">
              ${item.price.toFixed(2)}
            </div>

            <div className="col-span-2 flex items-center gap-3">
              <button
                onClick={() => onToggleAvailability(item.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  item.inStock ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    item.inStock ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>

              <span
                className={`text-xs font-medium ${
                  item.inStock ? "text-green-700" : "text-gray-500"
                }`}
              >
                {item.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <div className="col-span-1 flex justify-end gap-3">
              <button className="text-blue-600 hover:text-blue-700">
                <Pencil size={16} />
              </button>

              <button
                onClick={() => onDeleteItem(item.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuItemsTable;