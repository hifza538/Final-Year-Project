// customer-frontend/src/components/restaurant/ItemOptionsModal.jsx

import { useMemo, useState } from "react";
import { X, Minus, Plus, UtensilsCrossed } from "lucide-react";

const norm = (s) => String(s ?? "").trim().toLowerCase();

const optionPrice = (option, variant) => {
  const match = (option.sizePrices || []).find((s) => norm(s.label) === norm(variant?.label));
  return match ? match.price : option.price;
};

const ItemOptionsModal = ({ item, onClose, onAdd }) => {
  const [variantId, setVariantId] = useState(
    item.variants.length === 1 ? item.variants[0]._id : item.variants[0]?._id
  );
  const [selected, setSelected] = useState({}); 
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  const variant = item.variants.find((v) => v._id === variantId);

  const toggleOption = (group, optionId) => {
    setError("");
    setSelected((prev) => {
      const current = new Set(prev[group._id] || []);
      const isSingle = group.maxSelect === 1;

      if (current.has(optionId)) {
        current.delete(optionId);
      } else {
        if (isSingle) current.clear();
        else if (group.maxSelect > 0 && current.size >= group.maxSelect) return prev;
        current.add(optionId);
      }
      return { ...prev, [group._id]: current };
    });
  };

  const total = useMemo(() => {
    if (!variant) return 0;
    let sum = variant.price;
    for (const group of item.addonGroups || []) {
      const chosenIds = selected[group._id] || new Set();
      for (const option of group.options) {
        if (chosenIds.has(option._id)) sum += optionPrice(option, variant);
      }
    }
    return sum * qty;
  }, [variant, selected, qty, item.addonGroups]);

  const handleAdd = () => {
    for (const group of item.addonGroups || []) {
      const count = (selected[group._id] || new Set()).size;
      if (count < group.minSelect) {
        setError(`Please choose at least ${group.minSelect} option(s) from "${group.name}"`);
        return;
      }
    }

    const addonOptionIds = (item.addonGroups || []).flatMap((g) => [...(selected[g._id] || [])]);

    onAdd({
      _id: item._id,
      itemId: item._id,
      name: item.name,
      image: item.image,
      price: total / qty,
      variantId,
      addonOptionIds,
      qty,
      unitPriceEstimate: total / qty,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h3 className="font-bold text-gray-900 truncate pr-4">{item.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {item.image?.url ? (
            <img src={item.image.url} alt={item.name} className="w-full h-36 object-cover rounded-xl" />
          ) : (
            <div className="w-full h-36 rounded-xl bg-primary-light flex items-center justify-center">
              <UtensilsCrossed size={24} className="text-primary/40" />
            </div>
          )}

          {item.description && <p className="text-sm text-gray-500">{item.description}</p>}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">{error}</div>
          )}

          {item.variants.length > 1 && (
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">Choose a size</p>
              <div className="space-y-2">
                {item.variants.filter((v) => v.isAvailable).map((v) => (
                  <label
                    key={v._id}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                      variantId === v._id ? "border-primary bg-primary-light" : "border-gray-200"
                    }`}
                  >
                    <span className="flex items-center gap-2 text-sm text-gray-800">
                      <input
                        type="radio"
                        name="variant"
                        checked={variantId === v._id}
                        onChange={() => setVariantId(v._id)}
                        className="accent-primary"
                      />
                      {v.label}
                    </span>
                    <span className="text-sm font-medium text-gray-700">Rs {v.price.toLocaleString()}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {(item.addonGroups || []).map((group) => (
            <div key={group._id}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-900">{group.name}</p>
                {group.minSelect > 0 && <span className="text-xs text-primary">Required</span>}
              </div>
              <div className="space-y-2">
                {group.options.filter((o) => o.isAvailable).map((o) => {
                  const checked = (selected[group._id] || new Set()).has(o._id);
                  const price = optionPrice(o, variant);
                  const isSingle = group.maxSelect === 1;
                  return (
                    <label
                      key={o._id}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                        checked ? "border-primary bg-primary-light" : "border-gray-200"
                      }`}
                    >
                      <span className="flex items-center gap-2 text-sm text-gray-800">
                        <input
                          type={isSingle ? "radio" : "checkbox"}
                          name={isSingle ? `group-${group._id}` : undefined}
                          checked={checked}
                          onChange={() => toggleOption(group, o._id)}
                          className="accent-primary"
                        />
                        {o.name}
                      </span>
                      {price > 0 && <span className="text-sm text-gray-500">+Rs {price.toLocaleString()}</span>}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white">
          <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-2 py-1.5">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="text-gray-500 hover:text-gray-800 transition-colors">
              <Minus size={16} />
            </button>
            <span className="text-sm font-semibold w-4 text-center">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="text-gray-500 hover:text-gray-800 transition-colors">
              <Plus size={16} />
            </button>
          </div>
          <button
            onClick={handleAdd}
            disabled={!variant}
            className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white text-sm font-semibold transition-colors"
          >
            Add · Rs {total.toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemOptionsModal;
