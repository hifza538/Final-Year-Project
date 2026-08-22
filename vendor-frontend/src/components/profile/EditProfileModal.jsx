// vendor-frontend/src/components/profile/EditProfileModal.jsx

import { useState } from "react";
import { Store, Loader2, X } from "lucide-react";
import { updateProfile } from "../../services/profileService";
import Toggle from "./Toggle";

const EditProfileModal = ({ vendor, onClose, onSaved }) => {
  const [form, setForm] = useState({
    shopName:     vendor?.shopName     || "",
    shopAddress:  vendor?.shopAddress  || "",
    city:         vendor?.city         || "",
    zone:         vendor?.zone         || "",
    cuisine:      vendor?.cuisine      || "",
    openingTime:  vendor?.openingTime  || "09:00",
    closingTime:  vendor?.closingTime  || "22:00",
    minPrepTime:  vendor?.minPrepTime  || 15,
    maxPrepTime:  vendor?.maxPrepTime  || 45,
    deliveryFee:  vendor?.deliveryFee  ?? 50,
    serviceTypes: {
      delivery: vendor?.serviceTypes?.delivery ?? true,
      pickup:   vendor?.serviceTypes?.pickup   ?? true,
    },
  });

  const [coverPreview, setCoverPreview] = useState(vendor?.coverPhoto?.url || "");
  const [logoPreview, setLogoPreview] = useState(vendor?.logo?.url || "");
  const [coverFile, setCoverFile] = useState(null);
  const [logoFile, setLogoFile]   = useState(null);

  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

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

  const validate = () => {
    const errors = {};
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!form.shopName.trim())
      errors.shopName = "Shop name is required";
    else if (form.shopName.trim().length < 3)
      errors.shopName = "Shop name must be at least 3 characters";

    if (!form.shopAddress.trim())
      errors.shopAddress = "Shop address is required";
    else if (form.shopAddress.trim().length < 10)
      errors.shopAddress = "Please provide a complete address";

    if (!form.city.trim())
      errors.city = "City is required";

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
      Object.entries(form).forEach(([key, value]) => {
        if (key === "serviceTypes") {
          formData.append("serviceTypes[delivery]", value.delivery);
          formData.append("serviceTypes[pickup]", value.pickup);
        } else {
          formData.append(key, value);
        }
      });

      if (coverFile) formData.append("coverPhoto", coverFile);
      if (logoFile) formData.append("logo", logoFile);

      const data = await updateProfile(formData);
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

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="font-bold text-gray-900">Edit Profile</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Cover Photo
            </label>
            <div className="relative w-full h-32 bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-primary/40 transition-colors">
              {coverPreview ? (
                <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
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

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Restaurant Logo
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-primary/40 transition-colors flex-shrink-0">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
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
              <p className="text-red-500 text-xs mt-1">{fieldErrors.shopName}</p>
            )}
          </div>

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
              <p className="text-red-500 text-xs mt-1">{fieldErrors.shopAddress}</p>
            )}
          </div>

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
                <p className="text-red-500 text-xs mt-1">{fieldErrors.openingTime}</p>
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
                <p className="text-red-500 text-xs mt-1">{fieldErrors.closingTime}</p>
              )}
            </div>
          </div>

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
                <p className="text-red-500 text-xs mt-1">{fieldErrors.minPrepTime}</p>
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
                <p className="text-red-500 text-xs mt-1">{fieldErrors.maxPrepTime}</p>
              )}
            </div>
          </div>

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
              <p className="text-red-500 text-xs mt-1">{fieldErrors.deliveryFee}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              This is the flat fee customers pay for delivery from your restaurant.
            </p>
          </div>

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
                rounded-lg bg-primary hover:bg-primary-dark disabled:bg-primary/50 
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

export default EditProfileModal;