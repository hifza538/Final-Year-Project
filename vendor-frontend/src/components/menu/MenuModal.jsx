// vendor-frontend/src/components/menu/MenuModal.jsx

import { useState } from "react";
import { Loader2, X, UtensilsCrossed } from "lucide-react";
import api from "../../services/api";
import { CATEGORIES } from "./CategoryDropdown";

const MenuModal = ({ item, onClose, onSaved }) => {
  const isEditing = !!item;

  const [form, setForm] = useState({
    name:        item?.name        || "",
    description: item?.description || "",
    price:       item?.price       || "",
    category:    item?.category    || "",
  });

  const [imageFile, setImageFile]     = useState(null);
  const [imagePreview, setImagePreview] = useState(
    item?.image?.url || ""
  );
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setError("");
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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

    if (!form.price)
      errors.price = "Price is required";
    else if (Number(form.price) <= 0)
      errors.price = "Price must be greater than 0";

    if (!form.category)
      errors.category = "Please select a category";

    if (form.description.trim().length > 500)
      errors.description = "Description must not exceed 500 characters";

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
      formData.append("price",       form.price);
      formData.append("category",    form.category);
      if (imageFile) formData.append("image", imageFile);

      let data;
      if (isEditing) {
        ({ data } = await api.put(`/vendor/menu/${item._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }));
      } else {
        ({ data } = await api.post("/vendor/menu", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }));
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
              placeholder="e.g. Chicken Burger"
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Price (Rs) <span className="text-red-500">*</span>
              </label>
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                type="number"
                min="1"
                placeholder="350"
                className={`w-full px-3 py-2.5 text-sm rounded-lg border 
                  focus:outline-none focus:ring-2 focus:ring-primary transition
                  ${fieldErrors.price
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200"}`}
              />
              {fieldErrors.price && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.price}
                </p>
              )}
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
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {fieldErrors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.category}
                </p>
              )}
            </div>
          </div>

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