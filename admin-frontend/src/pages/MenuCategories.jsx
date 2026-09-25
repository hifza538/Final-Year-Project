import { useEffect, useState } from "react";
import { Pencil, Plus, Tag, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../components/common/ConfirmModal";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../services/categoryService";

const MenuCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getAllCategories();
      setCategories(data.categories || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load menu categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, []);

  const handleAdd = async (event) => {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;

    setSaving(true);
    try {
      const data = await createCategory(cleanName);
      setCategories((current) => [...current, data.category].sort((a, b) => a.name.localeCompare(b.name)));
      setName("");
      toast.success("Menu category added");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add menu category");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (category) => {
    setEditingId(category._id);
    setEditingName(category.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEdit = async (id) => {
    const cleanName = editingName.trim();
    if (!cleanName) return;

    setSaving(true);
    try {
      const data = await updateCategory(id, { name: cleanName });
      setCategories((current) => current
        .map((category) => (category._id === id ? data.category : category))
        .sort((a, b) => a.name.localeCompare(b.name)));
      cancelEdit();
      toast.success("Menu category updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update menu category");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (category) => {
    try {
      const data = await updateCategory(category._id, { isActive: !category.isActive });
      setCategories((current) => current.map((item) => (item._id === category._id ? data.category : item)));
      toast.success(category.isActive ? "Category hidden" : "Category visible");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteCategory(deleteTarget._id);
      setCategories((current) => current.filter((category) => category._id !== deleteTarget._id));
      setDeleteTarget(null);
      toast.success("Menu category deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-secondary mb-1">Menu Categories</h1>
      <p className="text-sm text-gray-500 mb-6">
        Manage the categories vendors use to organize their menu items.
      </p>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Pizza, Burgers, Drinks"
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary"
          aria-label="New menu category name"
        />
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-60"
        >
          <Plus size={16} />
          Add
        </button>
      </form>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          {[1, 2, 3].map((item) => <div key={item} className="h-14 bg-gray-200 rounded-lg" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Tag className="mx-auto mb-2 text-gray-300" size={28} />
          No menu categories yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
          {categories.map((category) => (
            <div key={category._id} className="flex items-center justify-between gap-3 px-4 py-3">
              {editingId === category._id ? (
                <input
                  value={editingName}
                  onChange={(event) => setEditingName(event.target.value)}
                  autoFocus
                  className="flex-1 px-3 py-1.5 rounded-lg border border-primary text-sm outline-none"
                />
              ) : (
                <div className="flex items-center gap-3 min-w-0">
                  <Tag size={18} className={category.isActive ? "text-primary" : "text-gray-300"} />
                  <span className={`text-sm font-medium ${category.isActive ? "text-secondary" : "text-gray-400"}`}>
                    {category.name}
                  </span>
                  {!category.isActive && <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Hidden</span>}
                </div>
              )}

              <div className="flex items-center gap-1.5 shrink-0">
                {editingId === category._id ? (
                  <>
                    <button onClick={() => saveEdit(category._id)} disabled={saving} className="text-xs text-primary font-medium px-2.5 py-1">Save</button>
                    <button onClick={cancelEdit} className="text-xs text-gray-500 px-2.5 py-1">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => toggleActive(category)} className="text-xs text-gray-500 px-2.5 py-1">{category.isActive ? "Hide" : "Unhide"}</button>
                    <button onClick={() => startEdit(category)} className="p-1.5 text-gray-500 hover:bg-gray-50 rounded-lg" aria-label={`Edit ${category.name}`}><Pencil size={16} /></button>
                    <button onClick={() => setDeleteTarget(category)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" aria-label={`Delete ${category.name}`}><Trash2 size={16} /></button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete this menu category?"
        message={`Delete "${deleteTarget?.name}"? Categories used by menu items must be hidden instead.`}
        confirmLabel="Delete"
        variant="danger"
        isLoading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default MenuCategories;
