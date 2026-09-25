//admin-frontend/src/pages/Categories.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { getAllCuisines, createCuisine, updateCuisine, updateCuisineDetails, deleteCuisine } from "../services/cuisineService";
import ConfirmModal from "../components/common/ConfirmModal";
import CuisineThumb from "../components/cuisines/CuisineThumb";
import ImagePicker from "../components/cuisines/ImagePicker";

// Cuisines component for managing cuisines
const Cuisines = () => {
  const [cuisines, setCuisines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState(null); // File — required
  const [isAdding, setIsAdding] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState(null); // newly chosen File (replaces the saved image)
  const [savingEdit, setSavingEdit] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCuisines = async () => {
    setIsLoading(true);
    try {
      const data = await getAllCuisines();
      setCuisines(data.cuisines);
    } catch (error) {
      toast.error("Failed to load cuisines");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCuisines();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    if (!newImage) {
      toast.error("Please add an image for this cuisine");
      return;
    }

    setIsAdding(true);
    try {
      await createCuisine({ name: newName.trim(), image: newImage });
      toast.success("Cuisine added");
      setNewName("");
      setNewImage(null);
      fetchCuisines();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add category");
    } finally {
      setIsAdding(false);
    }
  };

  // Edit, Delete and Toggle Active functions
  const startEdit = (category) => {
    setEditingId(category._id);
    setEditName(category.name);
    setEditImage(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditImage(null);
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) return;
    setSavingEdit(true);
    try {
      await updateCuisineDetails(id, {
        name: editName.trim(),
        image: editImage, // only sent when a replacement was chosen — image can never be cleared
      });
      toast.success("Cuisine updated");
      cancelEdit();
      fetchCuisines();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update category");
    } finally {
      setSavingEdit(false);
    }
  };

  const toggleActive = async (category) => {
    try {
      await updateCuisine(category._id, { isActive: !category.isActive });
      toast.success(category.isActive ? "Cuisine hidden" : "Cuisine visible again");
      fetchCuisines();
    } catch (error) {
      toast.error("Failed to update cuisine");
    }
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      await deleteCuisine(deleteTarget.id);
      toast.success("Cuisine deleted");
      setDeleteTarget(null);
      fetchCuisines();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete cuisine");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-secondary mb-1">Cuisines</h1>
      <p className="text-sm text-gray-500 mb-6">
        Manage the cuisines vendors can select during registration.
      </p>

      {/* Add new cuisine */}
      <form onSubmit={handleAdd} className="mb-6">
        <div className="flex items-center gap-2">
          <ImagePicker
            file={newImage}
            onSelect={setNewImage}
            onClear={() => setNewImage(null)}
            required
          />
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Fast Food, BBQ, Desserts..."
            className="flex-1 min-w-0 px-4 py-2.5 rounded-lg border border-gray-200 text-sm
              outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            disabled={isAdding || !newName.trim() || !newImage}
            className="flex items-center gap-1.5 bg-primary text-white font-medium text-sm px-4 py-2.5
              rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Image is required - customers browse cuisines by this picture on the home page. Vendors only
          see the name.
        </p>
      </form>

      {isLoading ? (
        <div className="animate-pulse space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg" />
          ))}
        </div>
      ) : cuisines.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Tag className="mx-auto mb-2 text-gray-300" size={28} />
          No cuisines yet — add one above
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
          {cuisines.map((cuisine) => (
            <div key={cuisine._id} className="flex items-center justify-between gap-3 px-4 py-3">
              {editingId === cuisine._id ? (
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <ImagePicker
                    file={editImage}
                    existingUrl={cuisine.image?.url}
                    onSelect={setEditImage}
                    onClear={() => setEditImage(null)}
                    required
                  />
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                    className="flex-1 min-w-0 px-3 py-1.5 rounded-lg border border-primary text-sm outline-none"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 min-w-0">
                  <CuisineThumb cuisine={cuisine} />
                  <span
                    className={`text-sm font-medium truncate ${
                      cuisine.isActive ? "text-secondary" : "text-gray-400"
                    }`}
                  >
                    {cuisine.name}
                  </span>
                  {!cuisine.isActive && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-500">
                      Hidden
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-1.5 shrink-0">
                {editingId === cuisine._id ? (
                  <>
                    <button
                      onClick={() => saveEdit(cuisine._id)}
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
                      onClick={() => toggleActive(cuisine)}
                      className="text-xs font-medium text-gray-500 px-2.5 py-1 hover:bg-gray-50 rounded-lg"
                    >
                      {cuisine.isActive ? "Hide" : "Unhide"}
                    </button>
                    <button
                      onClick={() => startEdit(cuisine)}
                      className="p-1.5 text-gray-500 hover:bg-gray-50 rounded-lg"
                      aria-label="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: cuisine._id, name: cuisine.name })}
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
        title="Delete this cuisine?"
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

export default Cuisines;