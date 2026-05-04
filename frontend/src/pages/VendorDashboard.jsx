import React, { useState } from "react";
// Lucide icons import karein
import { 
  Bell, 
  ChevronDown, 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  Users, 
  Plus, 
  BarChart3,
  Check,
  X,
  Save,
  Pencil,
  Trash2,
} from "lucide-react";

const STAT_CARDS = [
  {
    label: "Total Orders",
    value: "1247",
    trend: 12.5,
    iconBg: "bg-blue-100 text-blue-600",
    icon: <ShoppingBag size={20} />,
  },
  {
    label: "Total Earnings",
    value: "$15842.50",
    trend: 8.3,
    iconBg: "bg-green-100 text-green-600",
    icon: <DollarSign size={20} />,
  },
  {
    label: "Pending Orders",
    value: "8",
    trend: -3.2,
    iconBg: "bg-orange-100 text-orange-600",
    icon: <Clock size={20} />,
  },
  {
    label: "Total Customers",
    value: "892",
    trend: 15.7,
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

// ✅ Menu items for “Menu Management” tab
const INITIAL_MENU_ITEMS = [
  {
    id: 1,
    name: "Margherita Pizza",
    category: "Pizza",
    price: 12.99,
    inStock: true,
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    category: "Pizza",
    price: 14.99,
    inStock: true,
  },
  {
    id: 3,
    name: "Burger Combo",
    category: "Burgers",
    price: 15.99,
    inStock: true,
  },
  {
    id: 4,
    name: "Caesar Salad",
    category: "Salads",
    price: 8.99,
    inStock: false,
  },
  {
    id: 5,
    name: "Pasta Carbonara",
    category: "Pasta",
    price: 13.99,
    inStock: true,
  },
  {
    id: 6,
    name: "Grilled Chicken",
    category: "Main Course",
    price: 16.99,
    inStock: true,
  },
  {
    id: 7,
    name: "Tiramisu",
    category: "Desserts",
    price: 6.99,
    inStock: true,
  },
];

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [menuItems, setMenuItems] = useState(INITIAL_MENU_ITEMS);

  const handleAccept = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "Accepted" } : order
      )
    );
  };

  const handleReject = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "Rejected" } : order
      )
    );
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

   // Menu management handlers
  const toggleAvailability = (itemId) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, inStock: !item.inStock } : item
      )
    );
  };

  const handleDeleteItem = (itemId) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleAddNewItem = () => {
    // Filhaal sirf console; baad me modal / form se connect kar sakti ho
    console.log("Add New Item clicked");
  };

  // ✅ NEW: Vendor Profile ka state
  const [shopName, setShopName] = useState("StreetBite Kitchen");
  const [location, setLocation] = useState("123 Main Street, Downtown");
  const [openingTime, setOpeningTime] = useState("09:00 am");
  const [closingTime, setClosingTime] = useState("10:00 pm");
  const [servicePickup, setServicePickup] = useState(true);
  const [serviceDelivery, setServiceDelivery] = useState(true);

  const handleSaveProfile = (e) => {
    e.preventDefault();

    const profileData = {
      shopName,
      location,
      openingTime,
      closingTime,
      serviceTypes: {
        pickup: servicePickup,
        delivery: serviceDelivery,
      },
    };

    console.log("Saving vendor profile:", profileData);
    // 🔜 yahan baad me API call laga sakti ho (axios/fetch)
    // example:
    // await axios.put("/api/vendor/profile", profileData);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-extrabold text-orange-500">StreetBite</span>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {["Dashboard", "Orders", "Menu", "Analytics"].map((item) => (
                <button key={item} className={item === "Dashboard" ? "text-orange-600 border-b-2 border-orange-500" : "text-gray-500"}>
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-gray-600">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold">VN</div>
              <div className="text-sm leading-tight">
                <p className="font-semibold text-gray-800">Vendor Name</p>
                <p className="text-xs text-gray-500">vendor@streetbite.com</p>
              </div>
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
        </div>
      </header>
    {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <section>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back! Here's what's happening today.</p>
        </section>

        {/* Stats Cards */}
        <section className="grid gap-4 md:grid-cols-4">
          {STAT_CARDS.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Quick Actions */}
        <section className="bg-orange-500 rounded-2xl text-white p-5">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl py-3 transition">
              <Plus size={18} /> Add New Item
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl py-3 transition">
              <ShoppingBag size={18} /> View All Orders
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl py-3 transition">
              <BarChart3 size={18} /> View Analytics
            </button>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="bg-white rounded-2xl shadow-sm">
          <div className="border-b px-6 pt-4 pb-2">
            <nav className="flex gap-6 text-sm">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 border-b-2 ${activeTab === tab ? "border-orange-500 text-orange-600 font-semibold" : "border-transparent text-gray-500"}`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        {/*sirf overview tab pe: Recent Orders */}
        {activeTab === "Overview" && (
          <>
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            <button className="text-sm font-medium text-orange-600 hover:text-orange-700">
              View all
            </button>
          </div>

          <div className="divide-y">
            {orders.map((order) => (
              <div
                key={order.id}
                className="px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-gray-900">
                      Order #{order.id}
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        STATUS_STYLES[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Customer:</span>{" "}
                    {order.customer}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Items:</span>{" "}
                    {order.items}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Clock size={14} />
                    <span>{order.timeAgo}</span>
                    <span className="ml-3 font-semibold text-gray-900">
                      {order.total}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start md:self-auto">
                  {order.status === "Pending" ? (
                    <>
                      <button
                        onClick={() => handleAccept(order.id)}
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium"
                      >
                        <Check size={16} className="mr-1" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(order.id)}
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium"
                      >
                        <X size={16} className="mr-1" />
                        Reject
                      </button>
                    </>
                  ) : (
                    <>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="Accepted">Accepted</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <button className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium">
                        Update
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
              </div>
              </>
        )}
            {/* 👉 Orders tab: All Orders (picture 2) */}
  {activeTab === "Orders" && (
    <div className="px-6 py-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        All Orders
      </h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border border-gray-200 bg-white shadow-sm px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            {/* LEFT: order info */}
            <div>
              <div className="flex items-center gap-3">
                <p className="font-semibold text-gray-900">
                  Order #{order.id}
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    STATUS_STYLES[order.status]
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-1">
                <span className="font-semibold">Customer:</span>{" "}
                {order.customer}
                  </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Items:</span>{" "}
                {order.items}
              </p>

              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <Clock size={14} />
                <span>{order.timeAgo}</span>
                <span className="ml-3 font-semibold text-gray-900">
                  {order.total}
                </span>
              </div>
            </div>

            {/* RIGHT: actions */}
            <div className="flex items-center gap-3 self-start md:self-auto">
              {order.status === "Pending" ? (
                <>
                  <button
                    onClick={() => handleAccept(order.id)}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium"
                  >
                    <Check size={16} className="mr-1" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(order.id)}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium"
                  >
                    <X size={16} className="mr-1" />
                    Reject
                  </button>
                </>
              ) : (
                <>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Accepted">Accepted</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium">
                    Update
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
  
  
          {/* MENU MANAGEMENT: table like screenshot */}
          {activeTab === "Menu Management" && (
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Menu Items
                </h2>
                <button
                  onClick={handleAddNewItem}
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
                >
                  <Plus size={16} />
                  <span>Add New Item</span>
                </button>
              </div>

              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                {/* Header row */}
                <div className="grid grid-cols-12 bg-gray-50 px-6 py-3 text-xs font-semibold text-gray-500">
                  <div className="col-span-4">ITEM NAME</div>
                  <div className="col-span-3">CATEGORY</div>
                  <div className="col-span-2">PRICE</div>
                  <div className="col-span-2">AVAILABILITY</div>
                  <div className="col-span-1 text-right">ACTIONS</div>
                </div>

                {/* Data rows */}
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 items-center px-6 py-4 text-sm border-t border-gray-100"
                  >
                    <div className="col-span-4 font-semibold text-gray-900">
                      {item.name}
                    </div>
                    <div className="col-span-3 text-gray-700">
                      {item.category}
                    </div>
                    <div className="col-span-2 font-semibold text-gray-900">
                      ${item.price.toFixed(2)}
                    </div>
                    <div className="col-span-2 flex items-center gap-3">
                      <button
                        onClick={() => toggleAvailability(item.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                          item.inStock ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            item.inStock ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <span
                        className={`text-xs font-medium ${
                          item.inStock ? "text-green-700" : "text-gray-500"
                        }`}
                      >
                        {item.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                    <div className="col-span-1 flex justify-end gap-3">
                      <button className="text-blue-600 hover:text-blue-700">
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* ANALYTICS: center icon + text (screenshot jaisa) */}
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

{/* ✅ NEW: Vendor Profile Section */}
      <section className="bg-white rounded-2xl shadow-sm p-6">
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Vendor Profile
          </h2>

          {/* Shop Name + Location */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Name
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="Enter shop name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="Enter shop location"
              />
            </div>
          </div>

          {/* Opening / Closing Time */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opening Time
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="09:00 am"
                />
                <Clock
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Closing Time
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="10:00 pm"
                />
                <Clock
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Service Type */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Service Type
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={servicePickup}
                  onChange={(e) => setServicePickup(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-800">Pickup</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={serviceDelivery}
                  onChange={(e) => setServiceDelivery(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-800">Delivery</span>
              </label>
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
            >
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </section>
      </main>
    </div>
  );
};


export default  VendorDashboard;
