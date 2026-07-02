import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChefHat, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import api from "../services/api";
import InputField from "../components/common/InputField";
import MapPicker from "../components/common/MapPicker";
import { reverseGeocode } from "../services/locationService";

// Cuisine types static list
const CUISINE_TYPES = [
  "Pakistani",
  "Chinese",
  "Fast Food",
  "BBQ",
  "Desi",
  "Italian",
  "Continental",
  "Thai",
  "Indian",
  "Seafood",
  "Desserts",
  "Beverages",
  "Bakery",
  "Healthy Food",
  "Broast & Fried Chicken",
];

// indicator for the current step in the multi-step form
const StepIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {Array.from({ length: totalSteps }, (_, i) => (
      <div key={i} className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            i + 1 === currentStep
              ? "bg-pink-500 text-white"
              : i + 1 < currentStep
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-500"
          }`}
        >
          {i + 1 < currentStep ? "✓" : i + 1}
        </div>
        {i < totalSteps - 1 && (
          <div
            className={`w-12 h-1 mx-1 rounded ${
              i + 1 < currentStep ? "bg-green-500" : "bg-gray-200"
            }`}
          />
        )}
      </div>
    ))}
  </div>
);

// register page component with multi-step form for restaurant registration
const Register = () => {
  const navigate = useNavigate();
  const [previews, setPreviews] = useState({ cnicFront: null, cnicBack: null });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    // Step 1 - Owner Info
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",

    // Step 2 - Restaurant Info
    shopName: "",
    cuisine: "",
    city: "",
    zone: "",
    coordinates: { lat: null, lng: null },
    shopAddress: "",
    minPrepTime: "",
    maxPrepTime: "",

    // Step 3 - Legal Info
    cnicNumber: "",
    ntnNumber: "",
    hasFoodLicense: false,
    cnicFront: null,
    cnicBack: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setError("");
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));

    // City change hone par zone reset karo
    if (name === "city") {
      setForm((prev) => ({
        ...prev,
        city: value,
        zone: "", // reset zone
      }));
      return;
    }

    // Min/Max prep time mein negative values block karo
    if ((name === "minPrepTime" || name === "maxPrepTime") && value !== "") {
      if (Number(value) < 0) return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  // Map location select handler
  const handleMapLocationSelect = async (lat, lng) => {
    const geo = await reverseGeocode(lat, lng);
    setForm((prev) => ({
      ...prev,
      city: geo.city,
      zone: geo.zone,
      shopAddress: geo.fullAddress || prev.shopAddress,
      coordinates: { lat, lng },
    }));
  };
  // CNIC images upload handler
  const handleImageUpload = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) return;

    // Size check (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "Image size must be less than 2MB",
      }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "Only image files are allowed",
      }));
      return;
    }

    // File object directly store karo
    setForm((prev) => ({ ...prev, [name]: file }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setPreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
  };

  // Image remove handler
  const handleRemoveImage = (fieldName) => {
    setForm((prev) => ({ ...prev, [fieldName]: null }));
    setPreviews((prev) => {
      if (prev[fieldName]) URL.revokeObjectURL(prev[fieldName]);
      return { ...prev, [fieldName]: null };
    });
  };

  // front-end validation
  const validateStep = (stepNumber) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+92|0)?3\d{9}$/;
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;

    if (stepNumber === 1) {
      if (!form.firstName.trim()) errors.firstName = "First name is required";
      else if (form.firstName.trim().length < 2)
        errors.firstName = "First name must be at least 2 characters";

      if (!form.lastName.trim()) errors.lastName = "Last name is required";
      else if (form.lastName.trim().length < 2)
        errors.lastName = "Last name must be at least 2 characters";

      if (!form.email.trim()) errors.email = "Email is required";
      else if (!emailRegex.test(form.email))
        errors.email = "Please enter a valid email";

      if (!form.phone.trim()) errors.phone = "Phone number is required";
      else if (!phoneRegex.test(form.phone))
        errors.phone = "Enter valid Pakistani number e.g. 03001234567";

      if (!form.password) errors.password = "Password is required";
      else if (form.password.length < 6)
        errors.password = "Password must be at least 6 characters";
    }

    if (stepNumber === 2) {
      if (!form.shopName.trim()) errors.shopName = "Shop name is required";
      else if (form.shopName.trim().length < 3)
        errors.shopName = "Shop name must be at least 3 characters";

      if (!form.cuisine.trim()) errors.cuisine = "Please select a cuisine type";

      if (!form.city.trim()) errors.city = "Please select a city";

      if (!form.zone.trim()) errors.zone = "Please select a zone";

      if (!form.shopAddress.trim())
        errors.shopAddress = "Shop address is required";
      else if (form.shopAddress.trim().length < 10)
        errors.shopAddress = "Please enter a complete address";

      if (
        form.minPrepTime &&
        (Number(form.minPrepTime) < 5 || Number(form.minPrepTime) > 120)
      )
        errors.minPrepTime = "Must be between 5 and 120 minutes";

      if (
        form.maxPrepTime &&
        Number(form.maxPrepTime) < Number(form.minPrepTime || 15)
      )
        errors.maxPrepTime = "Must be greater than minimum prep time";
    }

    if (stepNumber === 3) {
      if (!form.cnicNumber.trim())
        errors.cnicNumber = "CNIC number is required";
      else if (!cnicRegex.test(form.cnicNumber))
        errors.cnicNumber = "Format must be: XXXXX-XXXXXXX-X";

      if (!form.cnicFront) errors.cnicFront = "CNIC front image is required";
      if (!form.cnicBack) errors.cnicBack = "CNIC back image is required";
    }

    return errors;
  };

  const handleNext = () => {
    const errors = validateStep(step);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError("");
    setFieldErrors({});
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateStep(3);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val === null || val === undefined) return;

        // convert coordinates object to JSON string before appending
        if (key === "coordinates") {
          fd.append(key, JSON.stringify(val));
          return;
        }

        fd.append(key, val);
      });

      await api.post("/auth/register", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Registration Submitted!
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Your restaurant registration has been submitted successfully. Please
            wait for admin approval before logging in.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── Left Branding Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-pink-500 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <ChefHat size={22} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl">LocalBites</span>
        </div>
        <div>
          <h2 className="text-white text-4xl font-bold leading-snug mb-4">
            Join thousands of
            <br />
            restaurants online.
          </h2>
          <p className="text-pink-100 text-base leading-relaxed max-w-sm">
            Register your restaurant and start receiving orders from customers
            near you.
          </p>
          <div className="flex gap-3 mt-8">
            {[
              { label: "Active Vendors", value: "500+" },
              { label: "Cities", value: "10+" },
              { label: "Daily Orders", value: "2000+" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/15 rounded-xl px-4 py-3">
                <p className="text-white font-bold text-lg">{value}</p>
                <p className="text-pink-100 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-pink-200 text-xs">
          © {new Date().getFullYear()} LocalBites. All rights reserved.
        </p>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
              <ChefHat size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900">LocalBites Vendor</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Register Your Restaurant
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Step {step} of 3 —{" "}
            {step === 1
              ? "Owner Information"
              : step === 2
                ? "Restaurant Details"
                : "Legal & Compliance"}
          </p>

          <StepIndicator currentStep={step} totalSteps={3} />

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ── Step 1: Owner Info ── */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="First Name"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Ali"
                    required
                    error={fieldErrors.firstName}
                  />
                  <InputField
                    label="Last Name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Khan"
                    required
                    error={fieldErrors.lastName}
                  />
                </div>
                <InputField
                  label="Email Address"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="ali@restaurant.com"
                  required
                  error={fieldErrors.email}
                />
                <InputField
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="03001234567"
                  required
                  error={fieldErrors.phone}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      className={`w-full px-4 py-2.5 pr-11 rounded-lg border text-sm
                        focus:outline-none focus:ring-2 focus:ring-pink-500 transition ${
                          fieldErrors.password
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200"
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* ── Step 2: Restaurant Details ── */}
            {step === 2 && (
              <>
                <InputField
                  label="Restaurant Name"
                  name="shopName"
                  value={form.shopName}
                  onChange={handleChange}
                  placeholder="My Restaurant"
                  required
                  error={fieldErrors.shopName}
                />

                {/* Cuisine Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Cuisine Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="cuisine"
                    value={form.cuisine}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-white
                      focus:outline-none focus:ring-2 focus:ring-pink-500 transition ${
                        fieldErrors.cuisine
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200"
                      }`}
                  >
                    <option value="">Select Cuisine</option>
                    {CUISINE_TYPES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.cuisine && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.cuisine}
                    </p>
                  )}
                </div>
                {/* Map Location Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Shop Location <span className="text-red-500">*</span>
                  </label>
                  <MapPicker onLocationSelect={handleMapLocationSelect} />
                </div>

                {/* City & Zone  */}
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="selected from map"
                    required
                    error={fieldErrors.city}
                  />
                  <InputField
                    label="Zone/Area"
                    name="zone"
                    value={form.zone}
                    onChange={handleChange}
                    placeholder="selected from map"
                    required
                    error={fieldErrors.zone}
                  />
                </div>

                <InputField
                  label="Complete Address"
                  name="shopAddress"
                  value={form.shopAddress}
                  onChange={handleChange}
                  placeholder="Block 5, Gulshan-e-Iqbal, Karachi"
                  required
                  error={fieldErrors.shopAddress}
                />

                {/* Min/Max Prep Time - negative blocked */}
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Min Prep Time (mins)"
                    name="minPrepTime"
                    value={form.minPrepTime}
                    onChange={handleChange}
                    type="number"
                    placeholder="15"
                    min="0"
                    error={fieldErrors.minPrepTime}
                  />
                  <InputField
                    label="Max Prep Time (mins)"
                    name="maxPrepTime"
                    value={form.maxPrepTime}
                    onChange={handleChange}
                    type="number"
                    placeholder="45"
                    min="0"
                    error={fieldErrors.maxPrepTime}
                  />
                </div>
              </>
            )}

            {/* ── Step 3: Legal Info ── */}
            {step === 3 && (
              <>
                <InputField
                  label="CNIC Number"
                  name="cnicNumber"
                  value={form.cnicNumber}
                  onChange={handleChange}
                  placeholder="XXXXX-XXXXXXX-X"
                  required
                  error={fieldErrors.cnicNumber}
                />
                {/* CNIC Front Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    CNIC Front Image <span className="text-red-500">*</span>
                  </label>
                  {!form.cnicFront ? (
                    <label className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-gray-300 rounded-lg py-6 cursor-pointer hover:border-pink-400 transition-colors">
                      <span className="text-sm text-gray-500">
                        Click to upload CNIC front
                      </span>
                      <span className="text-xs text-gray-400">
                        JPG, PNG, WEBP (max 2MB)
                      </span>
                      <input
                        type="file"
                        name="cnicFront"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="border border-gray-200 rounded-lg p-2 flex items-center gap-3">
                      <img
                        src={previews.cnicFront}
                        alt="CNIC Front preview"
                        className="w-16 h-16 object-cover rounded"
                      />
                      <span className="text-sm text-gray-600 truncate flex-1">
                        {form.cnicFront.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage("cnicFront")}
                        className="text-red-500 text-xs font-medium hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {fieldErrors.cnicFront && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.cnicFront}
                    </p>
                  )}
                </div>

                {/* CNIC Back Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    CNIC Back Image <span className="text-red-500">*</span>
                  </label>
                  {!form.cnicBack ? (
                    <label className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-gray-300 rounded-lg py-6 cursor-pointer hover:border-pink-400 transition-colors">
                      <span className="text-sm text-gray-500">
                        Click to upload CNIC back
                      </span>
                      <span className="text-xs text-gray-400">
                        JPG, PNG, WEBP (max 2MB)
                      </span>
                      <input
                        type="file"
                        name="cnicBack"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="border border-gray-200 rounded-lg p-2 flex items-center gap-3">
                      <img
                        src={previews.cnicBack}
                        alt="CNIC Back preview"
                        className="w-16 h-16 object-cover rounded"
                      />
                      <span className="text-sm text-gray-600 truncate flex-1">
                        {form.cnicBack.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage("cnicBack")}
                        className="text-red-500 text-xs font-medium hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {fieldErrors.cnicBack && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.cnicBack}
                    </p>
                  )}
                </div>
                <InputField
                  label="NTN Number (Optional)"
                  name="ntnNumber"
                  value={form.ntnNumber}
                  onChange={handleChange}
                  placeholder="NTN-XXXXXXX"
                />
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hasFoodLicense"
                    checked={form.hasFoodLicense}
                    onChange={handleChange}
                    className="w-4 h-4 accent-pink-500"
                  />
                  <span className="text-sm text-gray-700">
                    I have a valid food license
                  </span>
                </label>
              </>
            )}

            {/* ── Navigation Buttons ── */}
            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-2.5 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white text-sm font-semibold transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Registration"
                  )}
                </button>
              )}
            </div>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-pink-500 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
