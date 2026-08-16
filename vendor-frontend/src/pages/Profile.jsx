import { useEffect, useState } from "react";
import {
  Store,
  Phone,
  Mail,
  Clock,
  Truck,
  ShoppingBag,
  Pencil,
  Loader2,
  CheckCircle2,
  X,
  MapPin,
  User,
  UtensilsCrossed,
  Timer,
  Camera,
  Wallet,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// Field displays a single profile info row
const Field = ({ label, value, icon: Icon }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon size={14} className="text-gray-500" />
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-sm text-gray-800 font-medium mt-0.5">
        {value || <span className="text-gray-300 italic">Not set</span>}
      </p>
    </div>
  </div>
);

// SectionCard wraps a group of fields in a card with a title
const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
      {Icon && (
        <div className="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center">
          <Icon size={14} className="text-primary-500" />
        </div>
      )}
      <h3 className="text-sm font-bold text-gray-800">{title}</h3>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

// StatPill small quick-glance stat used under the cover banner
const StatPill = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex-1 min-w-[150px]">
    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
      <Icon size={18} className="text-primary-500" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-sm font-bold text-gray-900 truncate">{value}</p>
    </div>
  </div>
);

// Toggle on/off switch for service types
const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-sm text-gray-700">{label}</span>
    <button
      type="button"
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 
        focus:outline-none ${checked ? "bg-primary" : "bg-gray-200"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full 
          shadow transition-transform duration-200 
          ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  </label>
);

//Skeleton Loader
const SkeletonSection = () => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-pulse space-y-4">
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-5" />
    {Array(3)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-lg" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3 bg-gray-100 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
  </div>
);

// edit modal for updating vendor profile
const EditModal = ({ vendor, onClose, onSaved }) => {
  const [form, setForm] = useState({
    shopName: vendor?.shopName || "",
    shopAddress: vendor?.shopAddress || "",
    city: vendor?.city || "",
    zone: vendor?.zone || "",
    cuisine: vendor?.cuisine || "",
    openingTime: vendor?.openingTime || "09:00",
    closingTime: vendor?.closingTime || "22:00",
    minPrepTime: vendor?.minPrepTime || 15,
    maxPrepTime: vendor?.maxPrepTime || 45,
    deliveryFee: vendor?.deliveryFee ?? 50,
    serviceTypes: {
      delivery: vendor?.serviceTypes?.delivery ?? true,
      pickup: vendor?.serviceTypes?.pickup ?? true,
    },
  });

  // Image Upload State
  const [coverPreview, setCoverPreview] = useState(
    vendor?.coverPhoto?.url || "",
  );
  const [logoPreview, setLogoPreview] = useState(vendor?.logo?.url || "");
  const [coverFile, setCoverFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  // image change handler
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size, max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    if (type === "cover") {
      setCoverFile(file);
      setCoverPreview(previewUrl);
    } else {
      setLogoFile(file);
      setLogoPreview(previewUrl);
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setError("");
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleToggle = (key) =>
    setForm((prev) => ({
      ...prev,
      serviceTypes: {
        ...prev.serviceTypes,
        [key]: !prev.serviceTypes[key],
      },
    }));

  //frontend Validation
  const validate = () => {
    const errors = {};
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!form.shopName.trim()) errors.shopName = "Shop name is required";
    else if (form.shopName.trim().length < 3)
      errors.shopName = "Shop name must be at least 3 characters";

    if (!form.shopAddress.trim())
      errors.shopAddress = "Shop address is required";
    else if (form.shopAddress.trim().length < 10)
      errors.shopAddress = "Please provide a complete address";

    if (!form.city.trim()) errors.city = "City is required";

    if (!timeRegex.test(form.openingTime))
      errors.openingTime = "Invalid time format";

    if (!timeRegex.test(form.closingTime))
      errors.closingTime = "Invalid time format";

    if (form.openingTime >= form.closingTime)
      errors.closingTime = "Closing time must be after opening time";

    if (Number(form.minPrepTime) < 5 || Number(form.minPrepTime) > 120)
      errors.minPrepTime = "Must be between 5 and 120 minutes";

    if (Number(form.maxPrepTime) < Number(form.minPrepTime))
      errors.maxPrepTime = "Must be greater than minimum prep time";
    if (form.deliveryFee === "" || Number(form.deliveryFee) < 0)
      errors.deliveryFee = "Delivery fee cannot be negative";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      //append text fields
      Object.entries(form).forEach(([key, value]) => {
        if (key === "serviceTypes") {
          formData.append("serviceTypes[delivery]", value.delivery);
          formData.append("serviceTypes[pickup]", value.pickup);
        } else {
          formData.append(key, value);
        }
      });

      //append image files
      if (coverFile) {
        formData.append("coverPhoto", coverFile);
      }
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const { data } = await api.put("/vendor/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onSaved(data.vendor);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="font-bold text-gray-900">Edit Profile</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">
              {error}
            </div>
          )}
          {/* Cover Photo Upload */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Cover Photo
            </label>
            <div className="relative w-full h-32 bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-primary/40 transition-colors">
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <Store size={24} className="mb-1" />
                  <p className="text-xs">Click to upload cover photo</p>
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={(e) => handleImageChange(e, "cover")}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Recommended: 1200x400px, max 5MB
            </p>
          </div>
          {/* Logo Upload */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Restaurant Logo
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-primary/40 transition-colors flex-shrink-0">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Store size={20} />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => handleImageChange(e, "logo")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">
                  Upload your restaurant logo
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Square image recommended, max 5MB
                </p>
              </div>
            </div>
          </div>
          {/* Shop Name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Shop Name <span className="text-red-500">*</span>
            </label>
            <input
              name="shopName"
              value={form.shopName}
              onChange={handleChange}
              placeholder="My Restaurant"
              className={`w-full px-3 py-2.5 text-sm rounded-lg border 
                focus:outline-none focus:ring-2 focus:ring-primary 
                focus:border-transparent transition
                ${fieldErrors.shopName ? "border-red-400 bg-red-50" : "border-gray-200"}`}
            />
            {fieldErrors.shopName && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.shopName}
              </p>
            )}
          </div>

          {/* Shop Address */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Shop Address <span className="text-red-500">*</span>
            </label>
            <input
              name="shopAddress"
              value={form.shopAddress}
              onChange={handleChange}
              placeholder="Block 5, Gulshan-e-Iqbal, Karachi"
              className={`w-full px-3 py-2.5 text-sm rounded-lg border 
                focus:outline-none focus:ring-2 focus:ring-primary 
                focus:border-transparent transition
                ${fieldErrors.shopAddress ? "border-red-400 bg-red-50" : "border-gray-200"}`}
            />
            {fieldErrors.shopAddress && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.shopAddress}
              </p>
            )}
          </div>

          {/* City + Zone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                City <span className="text-red-500">*</span>
              </label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Karachi"
                className={`w-full px-3 py-2.5 text-sm rounded-lg border 
                  focus:outline-none focus:ring-2 focus:ring-primary transition
                  ${fieldErrors.city ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {fieldErrors.city && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Zone
              </label>
              <input
                name="zone"
                value={form.zone}
                onChange={handleChange}
                placeholder="Gulshan"
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 
                  focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>
          </div>

          {/* Cuisine */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Cuisine Type
            </label>
            <input
              name="cuisine"
              value={form.cuisine}
              onChange={handleChange}
              placeholder="e.g. Pakistani, Chinese"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 
                focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          {/* Opening + Closing Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Opening Time
              </label>
              <input
                name="openingTime"
                value={form.openingTime}
                onChange={handleChange}
                type="time"
                className={`w-full px-3 py-2.5 text-sm rounded-lg border 
                  focus:outline-none focus:ring-2 focus:ring-primary transition
                  ${fieldErrors.openingTime ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {fieldErrors.openingTime && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.openingTime}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Closing Time
              </label>
              <input
                name="closingTime"
                value={form.closingTime}
                onChange={handleChange}
                type="time"
                className={`w-full px-3 py-2.5 text-sm rounded-lg border 
                  focus:outline-none focus:ring-2 focus:ring-primary transition
                  ${fieldErrors.closingTime ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {fieldErrors.closingTime && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.closingTime}
                </p>
              )}
            </div>
          </div>

          {/* Prep Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Min Prep Time (mins)
              </label>
              <input
                name="minPrepTime"
                value={form.minPrepTime}
                onChange={handleChange}
                type="number"
                min="5"
                max="120"
                className={`w-full px-3 py-2.5 text-sm rounded-lg border 
                  focus:outline-none focus:ring-2 focus:ring-primary transition
                  ${fieldErrors.minPrepTime ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {fieldErrors.minPrepTime && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.minPrepTime}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Max Prep Time (mins)
              </label>
              <input
                name="maxPrepTime"
                value={form.maxPrepTime}
                onChange={handleChange}
                type="number"
                min="5"
                max="120"
                className={`w-full px-3 py-2.5 text-sm rounded-lg border 
                  focus:outline-none focus:ring-2 focus:ring-primary transition
                  ${fieldErrors.maxPrepTime ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {fieldErrors.maxPrepTime && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.maxPrepTime}
                </p>
              )}
            </div>
          </div>
          {/* Delivery Fee */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Delivery Fee (Rs.)
            </label>
            <input
              name="deliveryFee"
              value={form.deliveryFee}
              onChange={handleChange}
              type="number"
              min="0"
              placeholder="50"
              className={`w-full px-3 py-2.5 text-sm rounded-lg border 
                focus:outline-none focus:ring-2 focus:ring-primary transition
                ${fieldErrors.deliveryFee ? "border-red-400 bg-red-50" : "border-gray-200"}`}
            />
            {fieldErrors.deliveryFee && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.deliveryFee}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              This is the flat fee customers pay for delivery from your
              restaurant.
            </p>
          </div>

          {/* Service Types */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-3">
              Services Offered
            </label>
            <div className="space-y-3 bg-gray-50 rounded-xl p-4">
              <Toggle
                label="Delivery"
                checked={form.serviceTypes.delivery}
                onChange={() => handleToggle("delivery")}
              />
              <Toggle
                label="Pickup"
                checked={form.serviceTypes.pickup}
                onChange={() => handleToggle("pickup")}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 
                text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 
                rounded-lg bg-primary hover:bg-primary/80 disabled:bg-primary/50 
                text-white text-sm font-semibold transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Profile Page
const Profile = () => {
  const { user, login, token } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [saved, setSaved] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/vendor/profile");
      setVendor(data.vendor);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaved = (updated) => {
    setVendor(updated);
    // Sync updated data with AuthContext
    login({ ...user, ...updated }, token);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Convert 24hr to 12hr format
  const fmt12 = (t) => {
    if (!t) return "Not set";
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  // Check if the shop is currently open based on opening and closing times
  const shopIsOpen = vendor?.isOpen ?? false;
  // Manually toggle open/closed status
  const handleToggleStatus = async () => {
    if (statusLoading) return;
    const nextStatus = !shopIsOpen;
    const prevVendor = vendor;

    // optimistic update
    setVendor((v) => ({ ...v, isOpen: nextStatus }));
    setStatusLoading(true);

    try {
      const { data } = await api.patch("/vendor/profile/status", {
        isOpen: nextStatus,
      });
      setVendor((v) => ({ ...v, isOpen: data.vendor?.isOpen ?? nextStatus }));
      login({ ...user, isOpen: nextStatus }, token);
    } catch (err) {
      // revert on failure
      setVendor(prevVendor);
      setError(err.response?.data?.message || "Failed to update shop status.");
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Success Toast */}
      {saved && (
        <div
          className="flex items-center gap-2 bg-green-50 border 
          border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg"
        >
          <CheckCircle2 size={16} />
          Profile updated successfully!
        </div>
      )}

      {/* Error State */}
      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 
          text-sm px-4 py-3 rounded-lg flex items-center justify-between"
        >
          <span>{error}</span>
          <button
            onClick={fetchProfile}
            className="text-red-500 underline text-xs ml-4"
          >
            Retry
          </button>
        </div>
      )}

      {/* Skeleton Loading */}
      {loading ? (
        <div className="space-y-4">
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array(2)
              .fill(0)
              .map((_, i) => (
                <SkeletonSection key={i} />
              ))}
          </div>
        </div>
      ) : vendor ? (
        <>
          {/* Cover Banner */}
          <div className="relative rounded-2xl overflow-hidden shadow-sm">
            <div
              className="h-48 sm:h-56 w-full relative bg-gradient-to-br from-primary-500 via-rose-500 to-orange-500 flex items-center justify-center"
              style={
                vendor.coverPhoto?.url
                  ? {
                      backgroundImage: `url(${vendor.coverPhoto.url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            >
              {!vendor.coverPhoto?.url && (
                <UtensilsCrossed
                  size={72}
                  className="text-white/20"
                  strokeWidth={1.5}
                />
              )}

              {/* Open Now / Closed Status Button */}
              <button
                type="button"
                onClick={handleToggleStatus}
                disabled={statusLoading}
                title="Click to toggle shop status"
                className={`absolute top-4 left-4 flex items-center gap-1.5 
                  text-xs font-semibold px-3 py-1.5 rounded-full text-white 
                  transition-colors cursor-pointer disabled:opacity-70
                  ${shopIsOpen ? "bg-primary hover:bg-primary/80" : "bg-gray-500 hover:bg-gray-600"}`}
              >
                {statusLoading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
                {shopIsOpen ? "Open Now" : "Closed"}
              </button>

              {/* Edit Profile button */}
              <button
                onClick={() => setShowEdit(true)}
                className="absolute top-4 right-4 flex items-center gap-2 
                  bg-black/40 hover:bg-black/55 backdrop-blur-sm text-white 
                  text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors"
              >
                <Camera size={14} />
                Change Cover
              </button>
            </div>

            {/* Logo + name strip */}
            <div className="bg-white px-6 pb-5 pt-0 flex items-end gap-4 -mt-10 relative">
              <div
                className="w-20 h-20 rounded-2xl bg-primary-500 border-4 border-white 
                  shadow-md flex items-center justify-center text-white text-2xl 
                  font-bold flex-shrink-0 overflow-hidden"
              >
                {vendor.logo?.url ? (
                  <img
                    src={vendor.logo.url}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  vendor.shopName?.[0]?.toUpperCase() || "V"
                )}
              </div>
              <div className="flex-1 min-w-0 pt-3">
                <p className="text-lg font-bold text-gray-900 truncate">
                  {vendor.shopName || "Shop name not set"}
                </p>
                <p className="text-sm text-gray-500">{vendor.fullName}</p>
              </div>
              <button
                onClick={() => setShowEdit(true)}
                className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/80 
                  text-white text-sm font-semibold px-4 py-2 rounded-lg 
                  transition-colors shadow-sm flex-shrink-0"
              >
                <Pencil size={14} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Mobile edit button */}
          <button
            onClick={() => setShowEdit(true)}
            className="sm:hidden w-full flex items-center justify-center gap-2 
              bg-primary hover:bg-primary/80 text-white text-sm font-semibold 
              px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <Pencil size={14} />
            Edit Profile
          </button>

          {/* Quick Stat Pills */}
          <div className="flex flex-wrap gap-3">
            <StatPill
              label="Hours"
              value={`${fmt12(vendor.openingTime)} - ${fmt12(vendor.closingTime)}`}
              icon={Clock}
            />
            <StatPill
              label="Prep Time"
              value={
                vendor.minPrepTime && vendor.maxPrepTime
                  ? `${vendor.minPrepTime}-${vendor.maxPrepTime} mins`
                  : "Not set"
              }
              icon={Timer}
            />
            <StatPill
              label="Delivery"
              value={
                vendor.serviceTypes?.delivery ? "Available" : "Unavailable"
              }
              icon={Truck}
            />
            <StatPill
              label="Pickup"
              value={vendor.serviceTypes?.pickup ? "Available" : "Unavailable"}
              icon={ShoppingBag}
            />
            <StatPill
              label="Delivery Fee"
              value={`Rs. ${vendor.deliveryFee ?? 50}`}
              icon={Wallet}
            />
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Account Info */}
            <SectionCard title="Account Info" icon={User}>
              <Field label="Full Name" value={vendor.fullName} icon={User} />
              <Field label="Email" value={vendor.email} icon={Mail} />
              <Field label="Phone" value={vendor.phone} icon={Phone} />
            </SectionCard>

            {/* Shop Details */}
            <SectionCard title="Shop Details" icon={Store}>
              <Field label="Shop Name" value={vendor.shopName} icon={Store} />
              <Field
                label="Cuisine"
                value={vendor.cuisine}
                icon={UtensilsCrossed}
              />
              <Field label="Address" value={vendor.shopAddress} icon={MapPin} />
              <Field
                label="City / Zone"
                value={
                  vendor.zone ? `${vendor.city} • ${vendor.zone}` : vendor.city
                }
                icon={MapPin}
              />
            </SectionCard>
          </div>
        </>
      ) : null}

      {/* Edit Modal */}
      {showEdit && vendor && (
        <EditModal
          vendor={vendor}
          onClose={() => setShowEdit(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

export default Profile;
