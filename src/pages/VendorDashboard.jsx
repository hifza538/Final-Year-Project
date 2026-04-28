import React, { useState } from "react";
import {
  ShoppingBag,
  DollarSign,
  Clock,
  Users,
  Plus,
  BarChart3,
} from "lucide-react";

import DashboardHeader from "../components/vendor/DashboardHeader";
import StatCard from "../components/vendor/StatCard";
import OrdersList from "../components/vendor/OrdersList";
import MenuItemsTable from "../components/vendor/MenuItemsTable";
import VendorProfileForm from "../components/vendor/VendorProfileForm";

const STAT_CARDS = [
  {
    label: "Total Orders",
    value: "1247",
    iconBg: "bg-blue-100 text-blue-600",
    icon: <ShoppingBag size={20} />,
  },
  {
    label: "Total Earnings",
    value: "$15842.50",
    iconBg: "bg-green-100 text-green-600",
    icon: <DollarSign size={20} />,
  },
  {
    label: "Pending Orders",
    value: "8",
    iconBg: "bg-orange-100 text-orange-600",
    icon: <Clock size={20} />,
  },
  {
    label: "Total Customers",
    value: "892",
    iconBg: "bg-purple-100 text-purple-600",
    icon: <Users size={20} />,
  },
];

const TABS = ["Overview", "Orders", "Menu Management", "Analytics"];

const INITIAL_ORDERS = [
  {
    id: "ORD-001",
    customer: "John Doe",
    items: "Margherita Pizza, Garlic Bread, Coke",
    timeAgo: "10 mins ago",
    total: "$28.50",
    status: "Pending",
  },
  {
    id: "ORD-002",
    customer: "Sarah Smith",
    items: "Burger Combo, French Fries",
    timeAgo: "15 mins ago",
    total: "$18.99",
    status: "Accepted",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    items: "Caesar Salad, Grilled Chicken, Iced Tea",
    timeAgo: "20 mins ago",
    total: "$32.75",
    status: "Preparing",
  },
];

const STATUS_STYLES = {
  Pending: "bg-yellow-100 text-yellow-700",
  Accepted: "bg-blue-100 text-blue-700",
  Preparing: "bg-purple-100 text-purple-700",
  Rejected: "bg-red-100 text-red-700",
  Completed: "bg-emerald-100 text-emerald-700",
};

const INITIAL_MENU_ITEMS = [
  { id: 1, name: "Margherita Pizza", category: "Pizza", price: 12.99, inStock: true },
  { id: 2, name: "Pepperoni Pizza", category: "Pizza", price: 14.99, inStock: true },
  { id: 3, name: "Burger Combo", category: "Burgers", price: 15.99, inStock: true },
  { id: 4, name: "Caesar Salad", category: "Salads", price: 8.99, inStock: false },
  { id: 5, name: "Pasta Carbonara", category: "Pasta", price: 13.99, inStock: true },
  { id: 6, name: "Grilled Chicken", category: "Main Course", price: 16.99, inStock: true },
  { id: 7, name: "Tiramisu", category: "Desserts", price: 6.99, inStock: true },
];

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [menuItems, setMenuItems] = useState(INITIAL_MENU_ITEMS);

  // Orders handlers
  const handleAccept = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Accepted" } : o))
    );
  };

  const handleReject = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Rejected" } : o))
    );
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // Menu handlers
  const toggleAvailability = (itemId) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, inStock: !item.inStock } : item
      )
    );
  };

  const handleDeleteItem = (itemId) => {
    setMenuItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleAddNewItem = () => {
    console.log("Add New Item clicked");
  };

  // Profile state
  const [shopName, setShopName] = useState("StreetBite Kitchen");
  const [location, setLocation] = useState("123 Main Street, Downtown");
  const [openingTime, setOpeningTime] = useState("09:00 am");
  const [closingTime, setClosingTime] = useState("10:00 pm");
  const [servicePickup, setServicePickup] = useState(true);
  const [serviceDelivery, setServiceDelivery] = useState(true);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    console.log("Saving vendor profile:", {
      shopName,
      location,
      openingTime,
      closingTime,
      serviceTypes: { pickup: servicePickup, delivery: serviceDelivery },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <section>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Welcome back! Here's what's happening today.
          </p>
        </section>

        {/* Stats */}
        <section className="grid gap-4 md:grid-cols-4">
          {STAT_CARDS.map((s) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              icon={s.icon}
              iconBg={s.iconBg}
            />
          ))}
        </section>

        {/* Quick Actions (page me hi rehne do for now) */}
        <section className="bg-orange-500 rounded-2xl text-white p-5">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <button
              onClick={() => {
                setActiveTab("Menu Management");
                handleAddNewItem();
              }}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl py-3 transition"
            >
              <Plus size={18} /> Add New Item
            </button>

            <button
              onClick={() => setActiveTab("Orders")}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl py-3 transition"
            >
              <ShoppingBag size={18} /> View All Orders
            </button>

            <button
              onClick={() => setActiveTab("Analytics")}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl py-3 transition"
            >
              <BarChart3 size={18} /> View Analytics
            </button>
          </div>
        </section>

        {/* Tabs */}
        <section className="bg-white rounded-2xl shadow-sm">
          <div className="border-b px-6 pt-4 pb-2">
            <nav className="flex gap-6 text-sm">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 border-b-2 ${
                    activeTab === tab
                      ? "border-orange-500 text-orange-600 font-semibold"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Overview */}
          {activeTab === "Overview" && (
            <>
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Orders
                </h2>
                <button
                  onClick={() => setActiveTab("Orders")}
                  className="text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                  View all
                </button>
              </div>

              <OrdersList
                variant="overview"
                orders={orders}
                statusStyles={STATUS_STYLES}
                onAccept={handleAccept}
                onReject={handleReject}
                onStatusChange={handleStatusChange}
              />
            </>
          )}

          {/* Orders */}
          {activeTab === "Orders" && (
            <div className="px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                All Orders
              </h2>
              <OrdersList
                variant="orders"
                orders={orders}
                statusStyles={STATUS_STYLES}
                onAccept={handleAccept}
                onReject={handleReject}
                onStatusChange={handleStatusChange}
              />
            </div>
          )}

          {/* Menu Management */}
          {activeTab === "Menu Management" && (
            <MenuItemsTable
              menuItems={menuItems}
              onAddNewItem={handleAddNewItem}
              onToggleAvailability={toggleAvailability}
              onDeleteItem={handleDeleteItem}
            />
          )}

          {/* Analytics */}
          {activeTab === "Analytics" && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <BarChart3 size={56} className="mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900">
                Analytics Dashboard
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Detailed analytics and reports coming soon...
              </p>
            </div>
          )}
        </section>

        {/* Vendor Profile */}
        <VendorProfileForm
          shopName={shopName}
          setShopName={setShopName}
          location={location}
          setLocation={setLocation}
          openingTime={openingTime}
          setOpeningTime={setOpeningTime}
          closingTime={closingTime}
          setClosingTime={setClosingTime}
          servicePickup={servicePickup}
          setServicePickup={setServicePickup}
          serviceDelivery={serviceDelivery}
          setServiceDelivery={setServiceDelivery}
          onSave={handleSaveProfile}
        />
      </main>
    </div>
  );
};

export default VendorDashboard;