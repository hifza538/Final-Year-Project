// admin-frontend/src/pages/VendorApprovals.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle, XCircle } from "lucide-react";
import {
  getPendingVendors,
  approveVendor,
  rejectVendor,
} from "../services/vendorService";

const VendorApprovals = () => {
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(null);

// Fetch pending vendors from the backend and handle loading state
  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const data = await getPendingVendors();
      setVendors(data.vendors);
    } catch (error) {
      toast.error("Failed to load pending vendors");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Handle approval of a vendor with confirmation prompt and update state accordingly.
  const handleApprove = async (id, shopName) => {
    if (!window.confirm(`Approve "${shopName}"?`)) return;
    setActionInProgress(id);
    try {
      await approveVendor(id);
      toast.success("Vendor approved");
      setVendors((prev) => prev.filter((v) => v._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Approval failed");
    } finally {
      setActionInProgress(null);
    }
  };

  // Handle rejection of a vendor with confirmation prompt and update state accordingly
  const handleReject = async (id, shopName) => {
    if (!window.confirm(`Reject "${shopName}"?`)) return;
    setActionInProgress(id);
    try {
      await rejectVendor(id);
      toast.success("Vendor rejected");
      setVendors((prev) => prev.filter((v) => v._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Rejection failed");
    } finally {
      setActionInProgress(null);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-secondary mb-6">
        Vendor Approvals
      </h1>

      {vendors.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No pending vendor approvals
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Shop Name</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Cuisine</th>
                <th className="px-4 py-3">CNIC</th>
                <th className="px-4 py-3">Registered</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium">{vendor.shopName}</td>
                  <td className="px-4 py-3">{vendor.fullName}</td>
                  <td className="px-4 py-3">{vendor.email}</td>
                  <td className="px-4 py-3">{vendor.phone}</td>
                  <td className="px-4 py-3">{vendor.city}</td>
                  <td className="px-4 py-3">{vendor.cuisine}</td>
                  <td className="px-4 py-3">{vendor.cnicNumber}</td>
                  <td className="px-4 py-3">
                    {new Date(vendor.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleApprove(vendor._id, vendor.shopName)}
                        disabled={actionInProgress === vendor._id}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                        aria-label="Approve"
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button
                        onClick={() => handleReject(vendor._id, vendor.shopName)}
                        disabled={actionInProgress === vendor._id}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        aria-label="Reject"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VendorApprovals;