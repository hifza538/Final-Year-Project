//admin-frontend/src/pages/Customers.jsx
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, Ban, Eye } from "lucide-react";
import { getAllCustomers, toggleCustomerBlock } from "../services/customerService";
import ConfirmModal from "../components/common/ConfirmModal";

// Status filters for the customers page
const statusFilters = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
];

const StatusBadge = ({ isActive }) =>
  isActive ? (
    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">Active</span>
  ) : (
    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">Blocked</span>
  );

// Customers component for managing customers
const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [actionInProgress, setActionInProgress] = useState(null);
  const [modalCustomer, setModalCustomer] = useState(null); // { id, fullName }

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (status !== "all") params.status = status;
      if (search.trim()) params.search = search.trim();

      const data = await getAllCustomers(params);
      setCustomers(data.customers);
    } catch (error) {
      toast.error("Failed to load customers");
    } finally {
      setIsLoading(false);
    }
  }, [status, search]);

  useEffect(() => {
    const timer = setTimeout(fetchCustomers, 400);
    return () => clearTimeout(timer);
  }, [fetchCustomers]);

  const closeModal = () => setModalCustomer(null);

  const confirmToggleBlock = async () => {
    setActionInProgress(modalCustomer.id);
    try {
      const data = await toggleCustomerBlock(modalCustomer.id);
      toast.success(data.message);
      closeModal();
      fetchCustomers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-secondary mb-6">Customers</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm
              outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                ${
                  status === f.value
                    ? "bg-primary text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-primary/40"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-200 rounded-lg" />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No customers found</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium">{customer.fullName}</td>
                  <td className="px-4 py-3">{customer.email}</td>
                  <td className="px-4 py-3">{customer.phone || "—"}</td>
                  <td className="px-4 py-3">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge isActive={customer.isActive} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/customers/${customer._id}`}
                        className="p-1.5 text-gray-500 hover:bg-gray-50 rounded-lg"
                        aria-label="View details"
                      >
                        <Eye size={18} />
                      </Link>

                      <button
                        onClick={() =>
                          setModalCustomer({ id: customer._id, fullName: customer.fullName })
                        }
                        disabled={actionInProgress === customer._id}
                        className={`p-1.5 rounded-lg disabled:opacity-50 ${
                          customer.isActive
                            ? "text-red-600 hover:bg-red-50"
                            : "text-green-600 hover:bg-green-50"
                        }`}
                        aria-label={customer.isActive ? "Block" : "Unblock"}
                      >
                        <Ban size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalCustomer && (
        <ConfirmModal
          isOpen
          title="Are you sure?"
          message={`This will change ${modalCustomer.fullName}'s access to their account.`}
          confirmLabel="Confirm"
          variant="danger"
          isLoading={actionInProgress === modalCustomer.id}
          onConfirm={confirmToggleBlock}
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

export default Customers;