import { useEffect, useState, useRef } from "react";
import {
  Plus, Pencil, Trash2, Loader2, X,
  UtensilsCrossed, ToggleLeft, ToggleRight,
  Search, Filter, ChevronDown, Check,
} from "lucide-react";
import api from "../services/api";

// constants
const CATEGORIES = [
  "Burgers", "Pizza", "Biryani", "Drinks",
  "Desserts", "Sides", "Salads", "Breakfast", "Other",
];

// Custom category dropdown (styled, not the native <select>)
const CategoryDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = ["All", ...CATEGORIES];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between gap-3 pl-4 pr-3 py-2.5 
          text-sm rounded-lg border border-gray-200 bg-white 
          hover:border-pink-300 transition-colors min-w-[180px]"
      >
        <span className="flex items-center gap-2 text-gray-700">
          <Filter size={14} className="text-gray-400" />
          {value === "All" ? "All Categories" : value}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white rounded-xl 
            border border-gray-100 shadow-lg py-1.5 z-20 max-h-72 
            overflow-y-auto"
        >
          {options.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                onChange(cat);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 
                py-2 text-sm text-left transition-colors ${
                  value === cat
                    ? "text-pink-600 bg-pink-50 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
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

// skelton loader
const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-100 animate-pulse">
    <div className="h-40 bg-gray-200 rounded-t-xl" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/4" />
    </div>
  </div>
);

// menu item card
const MenuCard = ({ item, onEdit, onDelete, onToggleStock }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm 
    hover:shadow-md transition-shadow overflow-hidden">

    {/* Item Image */}
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

      {/* Stock Badge */}
      <span className={`absolute top-2 right-2 text-xs font-semibold 
        px-2 py-0.5 rounded-full ${
          item.inStock
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}>
        {item.inStock ? "In Stock" : "Out of Stock"}
      </span>

      {/* Category Badge */}
      <span className="absolute top-2 left-2 text-xs font-semibold 
        px-2 py-0.5 rounded-full bg-white/90 text-gray-700">
        {item.category}
      </span>
    </div>

    {/* Item Info */}
    <div className="p-4">
      <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
      {item.description && (
        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
          {item.description}
        </p>
      )}
      <p className="text-lg font-bold text-pink-500 mt-2">
        Rs {item.price.toLocaleString()}
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-3">
        {/* Toggle Stock */}
        <button
          onClick={() => onToggleStock(item._id, item.inStock)}
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
          {/* Edit */}
          <button
            onClick={() => onEdit(item)}
            className="w-8 h-8 flex items-center justify-center rounded-lg 
              bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-500 
              transition-colors"
          >
            <Pencil size={14} />
          </button>

          {/* Delete */}
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

// add/edit modal
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

  // frontend validation
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
      // Use FormData for file upload
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

        {/* Header */}
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

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Item Image
            </label>
            <div className="relative w-full h-40 bg-gray-100 rounded-xl 
              overflow-hidden border-2 border-dashed border-gray-200 
              hover:border-pink-300 transition-colors cursor-pointer">
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

          {/* Item Name */}
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
                focus:outline-none focus:ring-2 focus:ring-pink-500 transition
                ${fieldErrors.name
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200"}`}
            />
            {fieldErrors.name && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
            )}
          </div>

          {/* Description */}
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
                focus:outline-none focus:ring-2 focus:ring-pink-500 
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

          {/* Price + Category */}
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
                  focus:outline-none focus:ring-2 focus:ring-pink-500 transition
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
                  focus:outline-none focus:ring-2 focus:ring-pink-500 
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

          {/* Actions */}
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
                py-2.5 rounded-lg bg-pink-500 hover:bg-pink-600 
                disabled:bg-pink-300 text-white text-sm font-semibold 
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

// delete confirmation modal
const DeleteModal = ({ onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center 
    p-4 bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center 
        justify-center mx-auto mb-4">
        <Trash2 size={20} className="text-red-500" />
      </div>
      <h3 className="text-center font-bold text-gray-900 mb-2">
        Delete Menu Item?
      </h3>
      <p className="text-center text-sm text-gray-500 mb-6">
        This action cannot be undone. The item will be permanently deleted.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-lg border border-gray-200 
            text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 
            py-2.5 rounded-lg bg-red-500 hover:bg-red-600 
            disabled:bg-red-300 text-white text-sm font-semibold 
            transition-colors"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </div>
  </div>
);

// menu page
const Menu = () => {
  const [items, setItems]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [showModal, setShowModal]   = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [deleteId, setDeleteId]     = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch]         = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // fetch menu items
  const fetchMenu = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/vendor/menu");
      setItems(data.items);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load menu items."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // handle add/edit save
  const handleSaved = (savedItem, isEditing) => {
    if (isEditing) {
      setItems((prev) =>
        prev.map((i) => (i._id === savedItem._id ? savedItem : i))
      );
    } else {
      setItems((prev) => [savedItem, ...prev]);
    }
  };

  // handle delete
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/vendor/menu/${deleteId}`);
      setItems((prev) => prev.filter((i) => i._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete item."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // handle toggle stock
  const handleToggleStock = async (id) => {
    try {
      const { data } = await api.patch(
        `/vendor/menu/${id}/toggle-stock`
      );
      setItems((prev) =>
        prev.map((i) => (i._id === id ? data.item : i))
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update stock status."
      );
    }
  };

  // filter and search
  const filteredItems = items.filter((item) => {
    const matchSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchCategory =
      filterCategory === "All" || item.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{items.length}</span>{" "}
          item{items.length !== 1 ? "s" : ""} in your menu
        </p>
        <button
          onClick={() => {
            setEditItem(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 
            text-white text-sm font-semibold px-4 py-2 rounded-lg 
            transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 
          text-sm px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchMenu}
            className="text-red-500 underline text-xs ml-4"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search + Filter */}
      {!loading && items.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search menu items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border 
                border-gray-200 focus:outline-none focus:ring-2 
                focus:ring-pink-500 transition"
            />
          </div>

          {/* Category Filter */}
          <CategoryDropdown value={filterCategory} onChange={setFilterCategory} />
        </div>
      )}

      {/* Menu Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <MenuCard
              key={item._id}
              item={item}
              onEdit={(item) => {
                setEditItem(item);
                setShowModal(true);
              }}
              onDelete={(id) => setDeleteId(id)}
              onToggleStock={handleToggleStock}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl border border-dashed 
          border-gray-200 p-12 text-center">
          <div className="w-14 h-14 bg-pink-50 rounded-full flex items-center 
            justify-center mx-auto mb-4">
            <UtensilsCrossed size={24} className="text-pink-500" />
          </div>
          <h3 className="text-gray-800 font-semibold mb-1">
            {search || filterCategory !== "All"
              ? "No items match your search"
              : "No menu items yet"
            }
          </h3>
          <p className="text-gray-400 text-sm max-w-xs mx-auto mb-4">
            {search || filterCategory !== "All"
              ? "Try a different search or category filter"
              : "Add your first menu item to get started"
            }
          </p>
          {!search && filterCategory === "All" && (
            <button
              onClick={() => {
                setEditItem(null);
                setShowModal(true);
              }}
              className="inline-flex items-center gap-2 bg-pink-500 
                hover:bg-pink-600 text-white text-sm font-semibold 
                px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={16} />
              Add First Item
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <MenuModal
          item={editItem}
          onClose={() => {
            setShowModal(false);
            setEditItem(null);
          }}
          onSaved={handleSaved}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default Menu;