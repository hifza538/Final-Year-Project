// vendor-frontend/src/components/menu/MenuModal.jsx

import { useState } from "react";
import { Loader2, X, UtensilsCrossed, Plus, Trash2 } from "lucide-react";
import { addMenuItem, updateMenuItem } from "../../services/menuService";

const emptyVariant = () => ({ label: "", price: "" });

const MenuModal = ({ item, categories, addonGroups, onClose, onSaved }) => {
  const isEditing = !!item;

  const [form, setForm] = useState({
    name:        item?.name        || "",
    description: item?.description || "",
    category:    item?.category?._id || item?.category || "",
  });

  const [variants, setVariants] = useState(
    item?.variants?.length ? item.variants.map((v) => ({ ...v })) : [emptyVariant()]
  );
  const [selectedAddonGroups, setSelectedAddonGroups] = useState(
    (item?.addonGroups || []).map((g) => (typeof g === "string" ? g : g._id))
  );

  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState(item?.image?.url || "");
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [fieldErrors, setFieldErrors]   = useState({});

  const handleChange = (e) => {
    setError("");
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateVariant = (index, patch) =>
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, ...patch } : v)));

  const removeVariant = (index) =>
    setVariants((prev) => prev.filter((_, i) => i !== index));

  const toggleAddonGroup = (id) =>
    setSelectedAddonGroups((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const errors = {};

    if (!form.name.trim())
      errors.name = "Item name is required";
    else if (form.name.trim().length < 2)
      errors.name = "Name must be at least 2 characters";
    else if (form.name.trim().length > 100)
      errors.name = "Name must not exceed 100 characters";

    if (!form.category)
      errors.category = "Please select a category";

    if (form.description.trim().length > 500)
      errors.description = "Description must not exceed 500 characters";

    if (variants.length === 0) {
      errors.variants = "Add at least one size and price";
    } else if (variants.some((v) => !v.label.trim() || !v.price || Number(v.price) <= 0)) {
      errors.variants = "Every size needs a label and a price greater than 0";
    } else {
      const labels = variants.map((v) => v.label.trim().toLowerCase());
      if (new Set(labels).size !== labels.length) errors.variants = "Size labels must be unique";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name",        form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("category",    form.category);
      formData.append("variants",    JSON.stringify(
        variants.map((v) => ({ ...(v._id ? { _id: v._id } : {}), label: v.label.trim(), price: Number(v.price) }))
      ));
      formData.append("addonGroups", JSON.stringify(selectedAddonGroups));
      if (imageFile) formData.append("image", imageFile);

      let data;
      if (isEditing) {
        data = await updateMenuItem(item._id, formData);
      } else {
        data = await addMenuItem(formData);
      }

      onSaved(data.item, isEditing);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save item."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center 
      p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md 
        max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between px-6 py-4 
          border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="font-bold text-gray-900">
            {isEditing ? "Edit Menu Item" : "Add Menu Item"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 
              text-xs px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Item Image
            </label>
            <div className="relative w-full h-40 bg-gray-100 rounded-xl 
              overflow-hidden border-2 border-dashed border-gray-200 
              hover:border-primary/40 transition-colors cursor-pointer">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center 
                  justify-center text-gray-400 gap-2">
                  <UtensilsCrossed size={28} />
                  <p className="text-xs">Click to upload item image</p>
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              JPG or PNG, max 5MB
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Chicken Fajita Pizza"
              className={`w-full px-3 py-2.5 text-sm rounded-lg border 
                focus:outline-none focus:ring-2 focus:ring-primary transition
                ${fieldErrors.name
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200"}`}
            />
            {fieldErrors.name && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description of the item..."
              rows={3}
              className={`w-full px-3 py-2.5 text-sm rounded-lg border
                focus:outline-none focus:ring-2 focus:ring-primary
                transition resize-none
                ${fieldErrors.description
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200"}`}
            />
            <div className="flex justify-between mt-1">
              {fieldErrors.description && (
                <p className="text-red-500 text-xs">
                  {fieldErrors.description}
                </p>
              )}
              <p className="text-xs text-gray-400 ml-auto">
                {form.description.length}/500
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 text-sm rounded-lg border 
                focus:outline-none focus:ring-2 focus:ring-primary 
                transition bg-white
                ${fieldErrors.category
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200"}`}
            >
              <option value="">Select...</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            {fieldErrors.category && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.category}
              </p>
            )}
            {categories.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">
                No categories yet - add one from "Manage" on the Menu page first.
              </p>
            )}
          </div>

          {/* Sizes / prices */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-gray-700">
                Sizes & Prices <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-400">
                {variants.length === 1 ? "Single price item" : `${variants.length} sizes`}
              </span>
            </div>

            <div className="space-y-2">
              {variants.map((v, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={v.label}
                    onChange={(e) => updateVariant(i, { label: e.target.value })}
                    placeholder={variants.length === 1 ? "Regular" : "e.g. Medium"}
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                  <input
                    type="number" min="1"
                    value={v.price}
                    onChange={(e) => updateVariant(i, { price: e.target.value })}
                    placeholder="Rs"
                    className="w-24 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setVariants((prev) => [...prev, emptyVariant()])}
              className="flex items-center gap-1.5 text-xs text-primary hover:text-primary-dark transition-colors mt-2"
            >
              <Plus size={13} /> Add another size (e.g. Small / Medium / Large)
            </button>

            {fieldErrors.variants && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.variants}</p>
            )}
          </div>

          {/* Add-on groups */}
          {addonGroups.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Add-ons (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {addonGroups.map((group) => (
                  <button
                    key={group._id}
                    type="button"
                    onClick={() => toggleAddonGroup(group._id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      selectedAddonGroups.includes(group._id)
                        ? "bg-primary-light border-primary text-primary"
                        : "bg-white border-gray-200 text-gray-600 hover:border-primary/40"
                    }`}
                  >
                    {group.name}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                e.g. attach "Toppings" and "Stuffing" to a pizza item.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 
                text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 
                py-2.5 rounded-lg bg-primary hover:bg-primary-dark 
                disabled:bg-primary/50 text-white text-sm font-semibold 
                transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                isEditing ? "Save Changes" : "Add Item"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuModal;
