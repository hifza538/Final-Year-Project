//admin-frontend/src/pages/Categories.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { getAllCategories,createCategory,updateCategory,deleteCategory,} from "../services/categoryService";
import ConfirmModal from "../components/common/ConfirmModal";

// Categories component for managing categories
const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await getAllCategories();
      setCategories(data.categories);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsAdding(true);
    try {
      await createCategory(newName.trim());
      toast.success("Category added");
      setNewName("");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add category");
    } finally {
      setIsAdding(false);
    }
  };

  // Edit, Delete, and Toggle Active functions
  const startEdit = (category) => {
    setEditingId(category._id);
    setEditName(category.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) return;
    setSavingEdit(true);
    try {
      await updateCategory(id, { name: editName.trim() });
      toast.success("Category updated");
      cancelEdit();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update category");
    } finally {
      setSavingEdit(false);
    }
  };

  const toggleActive = async (category) => {
    try {
      await updateCategory(category._id, { isActive: !category.isActive });
      toast.success(category.isActive ? "Category hidden" : "Category visible again");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      await deleteCategory(deleteTarget.id);
      toast.success("Category deleted");
      setDeleteTarget(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-secondary mb-1">Categories</h1>
      <p className="text-sm text-gray-500 mb-6">
        Manage the cuisines vendors can select during registration.
      </p>

      {/* Add new category */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="e.g. Fast Food, BBQ, Desserts..."
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm
            outline-none focus:border-primary transition-colors"
        />
        <button
          type="submit"
          disabled={isAdding || !newName.trim()}
          className="flex items-center gap-1.5 bg-primary text-white font-medium text-sm px-4 py-2.5
            rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60"
        >
          <Plus size={16} />
          Add
        </button>
      </form>

      {isLoading ? (
        <div className="animate-pulse space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-200 rounded-lg" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Tag className="mx-auto mb-2 text-gray-300" size={28} />
          No categories yet — add one above
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
          {categories.map((category) => (
            <div key={category._id} className="flex items-center justify-between px-4 py-3">
              {editingId === category._id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  autoFocus
                  className="flex-1 mr-3 px-3 py-1.5 rounded-lg border border-primary text-sm outline-none"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${category.isActive ? "text-secondary" : "text-gray-400"}`}>
                    {category.name}
                  </span>
                  {!category.isActive && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-500">
                      Hidden
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-1.5 shrink-0">
                {editingId === category._id ? (
                  <>
                    <button
                      onClick={() => saveEdit(category._id)}
                      disabled={savingEdit}
                      className="text-xs font-medium text-primary px-2.5 py-1 hover:bg-primary-light rounded-lg disabled:opacity-60"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-xs font-medium text-gray-400 px-2.5 py-1 hover:bg-gray-50 rounded-lg"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => toggleActive(category)}
                      className="text-xs font-medium text-gray-500 px-2.5 py-1 hover:bg-gray-50 rounded-lg"
                    >
                      {category.isActive ? "Hide" : "Unhide"}
                    </button>
                    <button
                      onClick={() => startEdit(category)}
                      className="p-1.5 text-gray-500 hover:bg-gray-50 rounded-lg"
                      aria-label="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: category._id, name: category.name })}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                      aria-label="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete this category?"
        message={`"${deleteTarget?.name}" will be permanently removed. Vendors already using it won't be affected, but it won't be selectable anymore.`}
        confirmLabel="Delete"
        variant="danger"
        isLoading={actionLoading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Categories;