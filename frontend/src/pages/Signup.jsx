import { useState } from "react";
import { registerUser } from "../api/authapi";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Store,
  UserCircle,
  Eye,
  EyeOff,
  UtensilsCrossed,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();

 
  /*   States   */
  
  // Form input values
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Selected account role
  const [accountType, setAccountType] = useState("customer");

  // Loading state for submit button
  const [loading, setLoading] = useState(false);

  // Toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Error state for validation/API errors
  const [error, setError] = useState("");

  
  /*    Handlers / Methods   */
  
  // Update form field values
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // Submit signup form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim()
    ) {
      setError("Please fill all fields");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // Register new user
      await registerUser({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: accountType,
      });

      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      setError(error?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.25),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.18),transparent_30%),linear-gradient(135deg,#0f172a,#111827,#1e1b4b)]">
        <div className="absolute left-[-80px] top-[-80px] h-72 w-72 rounded-full bg-orange-500/20 blur-3xl"></div>
        <div className="absolute bottom-[-100px] right-[-50px] h-80 w-80 rounded-full bg-pink-500/20 blur-3xl"></div>

        <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="hidden lg:block">
            <div className="max-w-xl text-white">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-3 text-white shadow-lg shadow-orange-500/30">
                  <UtensilsCrossed size={24} />
                </div>
                <h1 className="text-3xl font-black tracking-tight">
                  Local<span className="text-orange-400">Bites</span>
                </h1>
              </div>

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-orange-400"></span>
                Join the local food community
              </div>

              <h2 className="text-5xl font-black leading-tight">
                Create your account
                <span className="mt-2 block bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                  and enjoy better food experiences
                </span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-300">
                Sign up as a customer to discover nearby restaurants, or join as
                a vendor to grow your food business and reach more hungry
                customers.
              </p>

              <div className="mt-10 space-y-4">
                <Benefit text="Explore nearby restaurants instantly" />
                <Benefit text="Order delicious meals quickly and easily" />
                <Benefit text="List your food business and start selling" />
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4">
                <StatCard title="500+" subtitle="Vendors" />
                <StatCard title="12k+" subtitle="Orders" />
                <StatCard title="4.9★" subtitle="Top Rated" />
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl">
            <div className="rounded-[2rem] border border-white/10 bg-white/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="mb-6 flex items-center justify-center gap-3 lg:hidden">
                <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-3 text-white">
                  <UtensilsCrossed size={22} />
                </div>
                <h1 className="text-2xl font-black text-slate-900">
                  Local<span className="text-orange-500">Bites</span>
                </h1>
              </div>

              <div className="mb-8 text-center">
                <h3 className="text-3xl font-black text-slate-900">
                  Create Account
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Join today and start enjoying delicious meals
                </p>
              </div>

              <div className="mb-8 grid grid-cols-2 rounded-2xl bg-gradient-to-r from-orange-100 to-red-100 p-2">
                <button
                  type="button"
                  onClick={() => setAccountType("customer")}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    accountType === "customer"
                      ? "bg-white text-orange-500 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <UserCircle size={18} />
                  Customer
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType("restaurantOwner")}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    accountType === "restaurantOwner"
                      ? "bg-white text-orange-500 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Store size={18} />
                  Vendor
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                  icon={<User size={18} />}
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />

                <InputField
                  icon={<Mail size={18} />}
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <InputField
                  icon={<Phone size={18} />}
                  type="text"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />

                <InputField
                  icon={<Lock size={18} />}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-slate-400 transition hover:text-orange-500"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />

                <InputField
                  icon={<Lock size={18} />}
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="text-slate-400 transition hover:text-orange-500"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />

                {/* Show validation/API error */}
                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600">
                Already have an account?
                <span
                  onClick={() => navigate("/login")}
                  className="ml-1 cursor-pointer font-semibold text-orange-500 hover:underline"
                >
                  Sign in
                </span>
              </p>

              <p className="mt-6 text-center text-xs leading-6 text-slate-500">
                By signing up, you agree to our{" "}
                <span className="cursor-pointer font-medium text-orange-500 underline">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="cursor-pointer font-medium text-orange-500 underline">
                  Privacy Policy
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

/* ---------------------------- Reusable Input ---------------------------- */
const InputField = ({ icon, rightIcon, ...props }) => {
  return (
    <div className="group">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-400 transition focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
        <span className="shrink-0">{icon}</span>

        <input
          {...props}
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />

        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </div>
    </div>
  );
};

const Benefit = ({ text }) => {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="text-orange-400" size={22} />
      <span className="text-base text-slate-200">{text}</span>
    </div>
  );
};

const StatCard = ({ title, subtitle }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <h4 className="text-2xl font-bold text-white">{title}</h4>
      <p className="text-sm text-slate-300">{subtitle}</p>
    </div>
  );
};