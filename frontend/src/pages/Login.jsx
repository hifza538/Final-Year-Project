import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  UtensilsCrossed,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../api/authapi";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

 
  /*      States      */
 
  // Form fields state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Loading state for submit button
  const [loading, setLoading] = useState(false);

  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  // Error message state
  const [error, setError] = useState("");

  /*    Handlers / Methods    */

  // Update form values when user types
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear old error when typing
    setError("");
  };

  // Handle login form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser(formData);

      // Save auth data in AuthContext + localStorage
      login(res.data.token, res.data.user);

      // Redirect user to previous protected page or home
      const redirectPath = location.state?.from?.pathname || "/";
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setError(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background layers */}
      <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.25),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.18),transparent_30%),linear-gradient(135deg,#0f172a,#111827,#1e1b4b)]">
        {/* Decorative blur circles */}
        <div className="absolute left-[-80px] top-[-80px] h-72 w-72 rounded-full bg-orange-500/20 blur-3xl"></div>
        <div className="absolute bottom-[-100px] right-[-50px] h-80 w-80 rounded-full bg-pink-500/20 blur-3xl"></div>

        <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* Left branding section */}
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
                Welcome back to your food world
              </div>

              <h2 className="text-5xl font-black leading-tight">
                Login and continue
                <span className="mt-2 block bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                  enjoying amazing meals
                </span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-300">
                Access your account to order from your favorite local
                restaurants, track your activity, and enjoy a seamless food
                experience.
              </p>

              <div className="mt-10 space-y-4">
                <Benefit text="Quick access to your favorite restaurants" />
                <Benefit text="Secure login and smooth ordering experience" />
                <Benefit text="Track orders and manage your account easily" />
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4">
                <StatCard title="500+" subtitle="Vendors" />
                <StatCard title="12k+" subtitle="Orders" />
                <StatCard title="4.9★" subtitle="Top Rated" />
              </div>
            </div>
          </div>

          {/* Login card */}
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
                <h3 className="text-3xl font-black text-slate-900">Welcome Back</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Login to continue ordering delicious food
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                  icon={<Mail size={18} />}
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
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

                {/* Error message */}
                {error && <p className="text-sm text-red-500">{error}</p>}

                {/* Forgot password */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm font-medium text-orange-500 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Logging in..." : "Login"}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600">
                Don’t have an account?
                <span
                  onClick={() => navigate("/signup")}
                  className="ml-1 cursor-pointer font-semibold text-orange-500 hover:underline"
                >
                  Sign up
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

/* ---------------------------- Reusable Input ---------------------------- */
const InputField = ({ icon, rightIcon, ...props }) => {
  return (
    <div>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-400 transition focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
        {icon && <span className="shrink-0">{icon}</span>}

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