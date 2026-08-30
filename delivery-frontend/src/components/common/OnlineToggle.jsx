// delivery-frontend/src/components/common/OnlineToggle.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import { updateOnlineStatus } from "../../services/statusService";
import { useAuth } from "../../context/AuthContext";

// Switch toggle for rider's online/offline status and shown on the dashboard
const OnlineToggle = () => {
  const { user, updateUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const isOnline = !!user?.isOnline;

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      const data = await updateOnlineStatus(!isOnline);
      updateUser({ isOnline: data.isOnline });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update status.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 mb-6">
      <div className="flex items-center gap-3">
        <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-300"}`} />
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {isOnline ? "You're Online" : "You're Offline"}
          </p>
          <p className="text-xs text-gray-400">
            {isOnline ? "You can now receive orders" : "Go online to start receiving orders"}
          </p>
        </div>
      </div>

      <button
        onClick={handleToggle}
        disabled={isUpdating}
        role="switch"
        aria-checked={isOnline}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 disabled:opacity-60
          ${isOnline ? "bg-primary" : "bg-gray-300"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
            ${isOnline ? "translate-x-6" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
};

export default OnlineToggle;