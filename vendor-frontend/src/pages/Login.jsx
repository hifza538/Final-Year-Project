import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChefHat, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/common/InputField";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // input change handler
  const handleChange = (e) => {
    setError("");
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // frontend validation function
  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation first
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/login", {
        email:    form.email.trim().toLowerCase(),
        password: form.password,
      });

      // Save to context and localStorage
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Left Branding Panel*/}
      <div className="hidden lg:flex lg:w-1/2 bg-pink-500 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <ChefHat size={22} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl">LocalBites</span>
        </div>

        <div>
          <h2 className="text-white text-4xl font-bold leading-snug mb-4">
            Manage your
            <br />
            restaurant with ease.
          </h2>
          <p className="text-pink-100 text-base leading-relaxed max-w-sm">
            Track orders in real time, update your menu, and grow your
            business — all from one place.
          </p>

          {/* Stat Pills */}
          <div className="flex gap-3 mt-8">
            {[
              { label: "Active Vendors", value: "500+" },
              { label: "Daily Orders",   value: "2000+" },
              { label: "Cities",         value: "10+" },
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

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
              <ChefHat size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900">LocalBites Vendor</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome back
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Sign in to your vendor account
          </p>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <InputField
              label="Email Address"
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="you@restaurant.com"
              required
              error={fieldErrors.email}
            />

            {/* Password */}
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
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full px-4 py-2.5 pr-11 rounded-lg border text-sm
                    text-gray-900 placeholder-gray-400 focus:outline-none 
                    focus:ring-2 focus:ring-pink-500 focus:border-transparent 
                    transition ${
                      fieldErrors.password
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 
                    text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 
                bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 
                text-white font-semibold py-2.5 rounded-lg text-sm 
                transition-colors mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            Not a vendor?{" "}
            <Link
              to="/register"
              className="text-pink-500 hover:underline font-medium"
            >
              Register your restaurant
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;