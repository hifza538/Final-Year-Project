// vendor-frontend/src/pages/Register.jsx

import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ChefHat, Eye, EyeOff, Loader2, CheckCircle2,
  Store, User, ShieldCheck, Users, ClipboardList, Headset,
} from "lucide-react";
import { registerVendor } from "../services/authService";
import InputField from "../components/common/InputField";
import MapPicker from "../components/common/MapPicker";
import { reverseGeocode } from "../services/locationService";
import { getActiveCategories } from "../services/categoryService";

// sections shown in the sticky nav, in scroll order
const SECTIONS = [
  { id: "basic", label: "Basic Details", icon: Store },
  { id: "owner", label: "Owner Info", icon: User },
  { id: "legal", label: "Legal", icon: ShieldCheck },
];

// benefits shown between the hero and the form
const BENEFITS = [
  { icon: Users, label: "Reach more customers" },
  { icon: ClipboardList, label: "Simple order management" },
  { icon: Headset, label: "Dedicated vendor support" },
];

// simple top bar - logo left, login link right
const Header = () => (
  <header className="bg-white border-b border-gray-100">
    <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
      <Link to="/" className="inline-flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <ChefHat size={18} className="text-white" />
        </div>
        <span className="text-lg font-bold text-secondary">
          Local<span className="text-primary">Bites</span>
        </span>
      </Link>
      <p className="text-sm text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  </header>
);

// distinct tinted hero, separate from the header
const Hero = () => (
  <div className="bg-primary-light">
    <div className="max-w-2xl mx-auto px-6 py-12 text-center">
      <h1 className="text-3xl font-bold text-secondary mb-2">
        Register your restaurant
      </h1>
      <p className="text-gray-600 text-sm">
        Start receiving orders from customers near you.
      </p>
    </div>
  </div>
);

// three quiet benefit cards - no fabricated stats, just what the platform actually offers
const Benefits = () => (
  <div className="max-w-2xl mx-auto px-6 -mt-6 relative z-10">
    <div className="grid grid-cols-3 gap-3">
      {BENEFITS.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="bg-white border border-gray-100 rounded-xl shadow-sm px-3 py-4 text-center"
        >
          <Icon size={20} className="text-primary mx-auto mb-2" />
          <p className="text-xs font-medium text-gray-700 leading-tight">{label}</p>
        </div>
      ))}
    </div>
  </div>
);

// sticky nav bar - highlights the section currently in view, click to jump
const SectionNav = ({ activeSection, onNavigate }) => (
  <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm pt-6 pb-3 mb-6">
    <div className="flex gap-1.5 bg-gray-100 rounded-xl p-1 max-w-2xl mx-auto">
      {SECTIONS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onNavigate(id)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${activeSection === id
              ? "bg-primary text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700"
            }`}
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </div>
  </div>
);

// wraps each section in a consistent card with a heading
const SectionCard = ({ id, title, icon: Icon, sectionRef, children }) => (
  <div id={id} ref={sectionRef} className="scroll-mt-24 mb-5">
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
      <h2 className="flex items-center gap-2 text-sm font-bold text-secondary mb-4">
        <Icon size={16} className="text-primary" />
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  </div>
);

// simple footer
const Footer = () => (
  <footer className="border-t border-gray-100 mt-4">
    <div className="max-w-4xl mx-auto px-6 py-6 text-center">
      <p className="text-xs text-gray-400">© 2026 LocalBites. All rights reserved.</p>
    </div>
  </footer>
);

const Register = () => {
  const navigate = useNavigate();
  const [previews, setPreviews] = useState({ cnicFront: null, cnicBack: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cuisinesOptions, setCuisinesOptions] = useState([]);
  const [activeSection, setActiveSection] = useState("basic");

  const sectionRefs = {
    basic: useRef(null),
    owner: useRef(null),
    legal: useRef(null),
  };

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const data = await getActiveCategories();
        setCuisinesOptions(data.categories.map((cat) => cat.name));
      } catch (err) {
        console.error("Failed to load cuisine options:", err);
      }
    };
    fetchCuisines();
  }, []);

  // Highlights the nav tab for whichever section is currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: [0.1, 0.3, 0.5] }
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNavigate = (id) => {
    sectionRefs[id]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const [form, setForm] = useState({
    // Owner Info
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",

    // Restaurant Info
    shopName: "",
    cuisine: "",
    city: "",
    zone: "",
    coordinates: { lat: null, lng: null },
    shopAddress: "",
    minPrepTime: "",
    maxPrepTime: "",
    deliveryRadius: 3,

    // Legal Info
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

    // Min/Max prep time mein negative aur 60 se zyada values block karo
    if ((name === "minPrepTime" || name === "maxPrepTime") && value !== "") {
      if (Number(value) < 0 || Number(value) > 60) return;
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

  // front-end validation - runs across all sections at once since there are no more steps
  const validateAll = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+92|0)?3\d{9}$/;
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;

    // Basic Details
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

    if (!form.minPrepTime) {
      errors.minPrepTime = "Min prep time is required";
    } else if (Number(form.minPrepTime) < 5 || Number(form.minPrepTime) > 60) {
      errors.minPrepTime = "Must be between 5 and 60 minutes";
    }

    if (!form.maxPrepTime) {
      errors.maxPrepTime = "Max prep time is required";
    } else if (Number(form.maxPrepTime) < 5 || Number(form.maxPrepTime) > 60) {
      errors.maxPrepTime = "Must be between 5 and 60 minutes";
    } else if (Number(form.maxPrepTime) < Number(form.minPrepTime)) {
      errors.maxPrepTime = "Must be greater than or equal to minimum prep time";
    }

    // Owner Info
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
      errors.phone = "Enter valid Pakistani number";

    if (!form.password) errors.password = "Password is required";
    else if (form.password.length < 6)
      errors.password = "Password must be at least 6 characters";

    // Legal Info
    if (!form.cnicNumber.trim())
      errors.cnicNumber = "CNIC number is required";
    else if (!cnicRegex.test(form.cnicNumber))
      errors.cnicNumber = "Format must be: XXXXX-XXXXXXX-X";

    if (!form.cnicFront) errors.cnicFront = "CNIC front image is required";
    if (!form.cnicBack) errors.cnicBack = "CNIC back image is required";

    return errors;
  };

  // jumps to the first section that has an error, so the person can see what's wrong
  const jumpToFirstError = (errors) => {
    const basicFields = ["shopName", "cuisine", "city", "zone", "shopAddress", "minPrepTime", "maxPrepTime"];
    const ownerFields = ["firstName", "lastName", "email", "phone", "password"];

    const firstErrorField = Object.keys(errors)[0];
    if (basicFields.includes(firstErrorField)) handleNavigate("basic");
    else if (ownerFields.includes(firstErrorField)) handleNavigate("owner");
    else handleNavigate("legal");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateAll();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      jumpToFirstError(errors);
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

      await registerVendor(fd);
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
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Hero />
      <Benefits />

      <div className="max-w-2xl mx-auto px-6 pb-12 flex-1 w-full">
        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mt-6">
            {error}
          </div>
        )}

        <SectionNav activeSection={activeSection} onNavigate={handleNavigate} />

        <form onSubmit={handleSubmit}>
          {/* Basic Details */}
          <SectionCard id="basic" title="Basic Details" icon={Store} sectionRef={sectionRefs.basic}>
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
                  focus:outline-none focus:ring-2 focus:ring-primary transition ${fieldErrors.cuisine
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200"
                  }`}
              >
                <option value="">Select Cuisine</option>
                {cuisinesOptions.map((c) => (
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

            {/* City & Zone */}
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
              placeholder="Enter your complete Address"
              required
              error={fieldErrors.shopAddress}
            />

            {/* Min/Max Prep Time  */}
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Min Prep Time (mins)"
                name="minPrepTime"
                value={form.minPrepTime}
                onChange={handleChange}
                type="number"
                placeholder="15"
                min="5"
                max="60"
                required
                error={fieldErrors.minPrepTime}
              />
              <InputField
                label="Max Prep Time (mins)"
                name="maxPrepTime"
                value={form.maxPrepTime}
                onChange={handleChange}
                type="number"
                placeholder="45"
                min="5"
                max="60"
                required
                error={fieldErrors.maxPrepTime}
              />
            </div>
            <div> <label className="block text-sm font-medium text-gray-700 mb-1.5"> Delivery Radius <span className="text-red-500">*</span> </label> <select name="deliveryRadius" value={form.deliveryRadius} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary transition" > <option value={2}>2 km</option> <option value={3}>3 km</option> <option value={5}>5 km</option> </select> <p className="text-xs text-gray-400 mt-1"> Customers outside this range won't see your restaurant. </p> </div>
          </SectionCard>

          {/* Owner Info */}
          <SectionCard id="owner" title="Owner Info" icon={User} sectionRef={sectionRefs.owner}>
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="first name"
                required
                error={fieldErrors.firstName}
              />
              <InputField
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="last name"
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
              placeholder="enter your email"
              required
              error={fieldErrors.email}
            />
            <InputField
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="enter phone number"
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
                  placeholder="enter password"
                  className={`w-full px-4 py-2.5 pr-11 rounded-lg border text-sm
                    focus:outline-none focus:ring-2 focus:ring-primary transition ${fieldErrors.password
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
          </SectionCard>

          {/* Legal Info */}
          <SectionCard id="legal" title="Legal & Compliance" icon={ShieldCheck} sectionRef={sectionRefs.legal}>
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
                <label className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-gray-300 rounded-lg py-6 cursor-pointer hover:border-primary/50 transition-colors">
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
                <label className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-gray-300 rounded-lg py-6 cursor-pointer hover:border-primary/50 transition-colors">
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
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-gray-700">
                I have a valid food license
              </span>
            </label>
          </SectionCard>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white text-sm font-semibold transition-colors"
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
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Register;