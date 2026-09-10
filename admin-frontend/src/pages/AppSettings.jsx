//admin-frontend/src/pages/AppSettings.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getSettings, updateSettings } from "../services/settingsService";

// AppSettings component for managing application settings
const AppSettings = () => {
  const [form, setForm] = useState({
    commissionPercentage: "",
    defaultDeliveryFee: "",
    minOrderAmount: "",
  });

  // State variables to manage loading and saving states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const data = await getSettings();
        setForm({
          commissionPercentage: data.settings.commissionPercentage,
          defaultDeliveryFee: data.settings.defaultDeliveryFee,
          minOrderAmount: data.settings.minOrderAmount,
        });
      } catch (error) {
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings({
        commissionPercentage: Number(form.commissionPercentage),
        defaultDeliveryFee: Number(form.defaultDeliveryFee),
        minOrderAmount: Number(form.minOrderAmount),
      });
      toast.success("Settings updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="animate-pulse h-64 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-secondary mb-1">App Settings</h1>
      <p className="text-sm text-gray-500 mb-6">
        These values apply across the platform for new orders and vendor calculations.
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">
            Commission Percentage (%)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={form.commissionPercentage}
            onChange={(e) => handleChange("commissionPercentage", e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary"
          />
          <p className="text-xs text-gray-400 mt-1">Percentage LocalBites takes from each completed order.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">
            Default Delivery Fee (Rs)
          </label>
          <input
            type="number"
            min="0"
            value={form.defaultDeliveryFee}
            onChange={(e) => handleChange("defaultDeliveryFee", e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">
            Minimum Order Amount (Rs)
          </label>
          <input
            type="number"
            min="0"
            value={form.minOrderAmount}
            onChange={(e) => handleChange("minOrderAmount", e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg
            hover:bg-primary-dark transition-colors disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
};

export default AppSettings;