// vendor-frontend/src/pages/Menu.jsx

import { useEffect, useState } from "react";
import { Plus, Search, UtensilsCrossed, Layers } from "lucide-react";
import { getMenuItems, deleteMenuItem, toggleMenuItemStock, getCategories, getAddonGroups } from "../services/menuService";
import MenuCard from "../components/menu/MenuCard";
import MenuCardSkeleton from "../components/menu/MenuCardSkeleton";
import MenuModal from "../components/menu/MenuModal";
import DeleteConfirmModal from "../components/menu/DeleteConfirmModal";
import CategorySelect from "../components/menu/CategorySelect";
import AddonGroupManager from "../components/menu/AddonGroupManager";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";

const Menu = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addonGroups, setAddonGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAddonManager, setShowAddonManager] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [menuData, categoryData, addonData] = await Promise.all([
        getMenuItems(),
        getCategories(),
        getAddonGroups(),
      ]);
      setItems(menuData.items);
      setCategories(categoryData.categories);
      setAddonGroups(addonData.addonGroups);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load menu items."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const refreshAddonGroups = async () => {
    const data = await getAddonGroups();
    setAddonGroups(data.addonGroups);
  };

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
      await deleteMenuItem(deleteId);
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
      const data = await toggleMenuItemStock(id);
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
      filterCategory === "All" || item.category?.name === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{items.length}</span>{" "}
          item{items.length !== 1 ? "s" : ""} in your menu
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddonManager(true)}
            className="flex items-center gap-2 border border-gray-200 hover:border-primary/40
              text-gray-600 text-sm font-semibold px-4 py-2 rounded-lg
              transition-colors"
          >
            <Layers size={16} />
            Add-ons
          </button>
          <button
            onClick={() => {
              setEditItem(null);
              setShowModal(true);
            }}
            disabled={categories.length === 0}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark
              disabled:bg-gray-300 disabled:cursor-not-allowed
              text-white text-sm font-semibold px-4 py-2 rounded-lg
              transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={fetchAll} />}

      {!loading && (
        <div className="flex gap-3 flex-wrap items-start">
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

          <CategorySelect
            value={filterCategory}
            onChange={setFilterCategory}
            categories={categories}
          />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <MenuCardSkeleton key={i} />)}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="No categories available yet"
          message="Categories are set up by the platform admin. Please check back once categories like Pizza or Burgers are added."
        />
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
          categories={categories}
          addonGroups={addonGroups}
          onClose={() => {
            setShowModal(false);
            setEditItem(null);
          }}
          onSaved={handleSaved}
        />
      )}

      {showAddonManager && (
        <AddonGroupManager
          addonGroups={addonGroups}
          onClose={() => setShowAddonManager(false)}
          onChanged={refreshAddonGroups}
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
