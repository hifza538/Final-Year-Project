// vendor-frontend/src/pages/Menu.jsx

import { useEffect, useState } from "react";
import { Plus, Search, UtensilsCrossed } from "lucide-react";
import api from "../services/api";
import MenuCard from "../components/menu/MenuCard";
import MenuCardSkeleton from "../components/menu/MenuCardSkeleton";
import MenuModal from "../components/menu/MenuModal";
import DeleteConfirmModal from "../components/menu/DeleteConfirmModal";
import CategoryDropdown from "../components/menu/CategoryDropdown";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";

const Menu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

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

  const handleSaved = (savedItem, isEditing) => {
    if (isEditing) {
      setItems((prev) =>
        prev.map((i) => (i._id === savedItem._id ? savedItem : i))
      );
    } else {
      setItems((prev) => [savedItem, ...prev]);
    }
  };

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
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark 
            text-white text-sm font-semibold px-4 py-2 rounded-lg 
            transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      {error && <ErrorState message={error} onRetry={fetchMenu} />}

      {!loading && items.length > 0 && (
        <div className="flex gap-3 flex-wrap">
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
                focus:ring-primary transition"
            />
          </div>

          <CategoryDropdown value={filterCategory} onChange={setFilterCategory} />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <MenuCardSkeleton key={i} />)}
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
        <EmptyState
          icon={UtensilsCrossed}
          title={
            search || filterCategory !== "All"
              ? "No items match your search"
              : "No menu items yet"
          }
          message={
            search || filterCategory !== "All"
              ? "Try a different search or category filter"
              : "Add your first menu item to get started"
          }
          actionLabel={!search && filterCategory === "All" ? "Add First Item" : null}
          onAction={
            !search && filterCategory === "All"
              ? () => {
                setEditItem(null);
                setShowModal(true);
              }
              : null
          }
        />
      )}
      
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

      {deleteId && (
        <DeleteConfirmModal
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default Menu;