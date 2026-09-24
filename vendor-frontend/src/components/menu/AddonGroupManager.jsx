// vendor-frontend/src/components/menu/AddonGroupManager.jsx

import { useState } from "react";
import { X, Plus, Trash2, Loader2, Layers, Pencil } from "lucide-react";
import { addAddonGroup, updateAddonGroup, deleteAddonGroup } from "../../services/menuService";

const emptyOption = () => ({ name: "", price: "", sizePrices: [] });

const AddonGroupManager = ({ addonGroups, onClose, onChanged }) => {
  const [editing, setEditing] = useState(null); // group being edited, or {} for new
  const [error, setError] = useState("");

  const startNew = () => setEditing({ name: "", minSelect: 0, maxSelect: 0, options: [emptyOption()] });

  const handleDelete = async (id) => {
    try {
      await deleteAddonGroup(id);
      onChanged();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete group");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h3 className="font-bold text-gray-900">Add-on Groups</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {editing ? (
          <AddonGroupForm
            group={editing}
            onCancel={() => setEditing(null)}
            onSaved={() => { setEditing(null); onChanged(); }}
          />
        ) : (
          <div className="px-6 py-5 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={startNew}
              className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              <Plus size={16} /> New add-on group
            </button>

            <div className="space-y-2">
              {addonGroups.map((group) => (
                <div key={group._id} className="border border-gray-100 rounded-lg px-3.5 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Layers size={14} className="text-gray-400 shrink-0" />
                      <span className="text-sm font-medium text-gray-800 truncate">{group.name}</span>
                      <span className="text-xs text-gray-400 shrink-0">
                        {group.minSelect > 0 ? `required, ` : ""}{group.options.length} option(s)
                      </span>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => setEditing(group)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(group._id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {addonGroups.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No add-on groups yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AddonGroupForm = ({ group, onCancel, onSaved }) => {
  const isEditing = !!group._id;
  const [name, setName] = useState(group.name);
  const [minSelect, setMinSelect] = useState(group.minSelect ?? 0);
  const [maxSelect, setMaxSelect] = useState(group.maxSelect ?? 0);
  const [options, setOptions] = useState(
    group.options?.length ? group.options.map((o) => ({ ...o, sizePrices: o.sizePrices || [] })) : [emptyOption()]
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const updateOption = (index, patch) =>
    setOptions((prev) => prev.map((o, i) => (i === index ? { ...o, ...patch } : o)));

  const addSizePrice = (index) =>
    updateOption(index, { sizePrices: [...options[index].sizePrices, { label: "", price: "" }] });

  const updateSizePrice = (optIndex, sizeIndex, patch) =>
    setOptions((prev) =>
      prev.map((o, i) =>
        i === optIndex
          ? { ...o, sizePrices: o.sizePrices.map((s, j) => (j === sizeIndex ? { ...s, ...patch } : s)) }
          : o
      )
    );

  const removeSizePrice = (optIndex, sizeIndex) =>
    setOptions((prev) =>
      prev.map((o, i) => (i === optIndex ? { ...o, sizePrices: o.sizePrices.filter((_, j) => j !== sizeIndex) } : o))
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Group name is required");
    if (options.some((o) => !o.name.trim())) return setError("Every option needs a name");

    const payload = {
      name: name.trim(),
      minSelect: Number(minSelect) || 0,
      maxSelect: Number(maxSelect) || 0,
      options: options.map((o) => ({
        ...(o._id ? { _id: o._id } : {}),
        name: o.name.trim(),
        price: Number(o.price) || 0,
        isAvailable: o.isAvailable !== false,
        sizePrices: o.sizePrices
          .filter((s) => s.label.trim())
          .map((s) => ({ label: s.label.trim(), price: Number(s.price) || 0 })),
      })),
    };

    setSaving(true);
    try {
      if (isEditing) await updateAddonGroup(group._id, payload);
      else await addAddonGroup(payload);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save group");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">{error}</div>
      )}

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Group name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Toppings"
          className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Min selections</label>
          <input
            type="number" min="0" value={minSelect}
            onChange={(e) => setMinSelect(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          <p className="text-xs text-gray-400 mt-1">0 = optional</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Max selections</label>
          <input
            type="number" min="0" value={maxSelect}
            onChange={(e) => setMaxSelect(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          <p className="text-xs text-gray-400 mt-1">0 = unlimited</p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-medium text-gray-700">Options</label>
        {options.map((opt, i) => (
          <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2">
            <div className="flex gap-2">
              <input
                value={opt.name}
                onChange={(e) => updateOption(i, { name: e.target.value })}
                placeholder="Option name (e.g. Chicken)"
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              <input
                type="number" min="0"
                value={opt.price}
                onChange={(e) => updateOption(i, { price: e.target.value })}
                placeholder="Flat Rs"
                className="w-24 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              {options.length > 1 && (
                <button
                  type="button"
                  onClick={() => setOptions((prev) => prev.filter((_, j) => j !== i))}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            {opt.sizePrices.map((sp, j) => (
              <div key={j} className="flex gap-2 pl-3">
                <input
                  value={sp.label}
                  onChange={(e) => updateSizePrice(i, j, { label: e.target.value })}
                  placeholder="Size (e.g. Large)"
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
                <input
                  type="number" min="0"
                  value={sp.price}
                  onChange={(e) => updateSizePrice(i, j, { price: e.target.value })}
                  placeholder="Rs"
                  className="w-20 px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
                <button type="button" onClick={() => removeSizePrice(i, j)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addSizePrice(i)}
              className="text-xs text-primary hover:text-primary-dark transition-colors pl-3"
            >
              + Different price for a size
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setOptions((prev) => [...prev, emptyOption()])}
          className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-dark transition-colors"
        >
          <Plus size={14} /> Add option
        </button>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white text-sm font-semibold transition-colors"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : isEditing ? "Save Changes" : "Create Group"}
        </button>
      </div>
    </form>
  );
};

export default AddonGroupManager;
