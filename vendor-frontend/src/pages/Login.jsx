import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/common/InputField";
import AuthLayout from "../components/layout/AuthLayout";
import { loginVendor } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
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
      const data = await loginVendor( {
        email: form.email.trim().toLowerCase(),
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
    <AuthLayout
      heading={<>Manage your<br />restaurant with ease.</>}
      subtext="Track orders in real time, update your menu, and grow your business — all from one place."
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Welcome back
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Sign in to your vendor account
      </p>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Email Address"
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          placeholder="Enter your email"
          required
          error={fieldErrors.email}
        />
        <InputField
          label="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          placeholder="Enter your password"
          required
          error={fieldErrors.password}
        />
        
        <div className="flex justify-end -mt-2 mb-2">
          <Link to="/forgot-password" className="text-xs text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 
            bg-primary hover:bg-primary-dark disabled:bg-primary/50 
            text-white font-semibold py-2.5 rounded-lg text-sm 
            transition-colors mt-2"
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin" />
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
          className="text-primary hover:underline font-medium"
        >
          Register your restaurant
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;