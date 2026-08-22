// vendor-frontend/src/pages/ResetPassword.jsx

import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import InputField from "../components/common/InputField";
import AuthLayout from "../components/layout/AuthLayout";
import { resetPassword } from "../services/authService";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setError("");
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errors = {};
    if (!form.password) errors.password = "Password is required";
    else if (form.password.length < 6) errors.password = "Password must be at least 6 characters";

    if (!form.confirmPassword) errors.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) errors.confirmPassword = "Passwords do not match";

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
      await resetPassword(token, form.password);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "This reset link is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      heading={<>Set a new<br />password.</>}
      subtext="Choose a strong password for your vendor account."
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Set New Password</h1>
      <p className="text-gray-500 text-sm mb-8">Enter a new password for your account.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="New Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          placeholder="Enter New Password"
          required
          error={fieldErrors.password}
        />
        <InputField
          label="Confirm Password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          type="password"
          placeholder="Confirm New Password"
          required
          error={fieldErrors.confirmPassword}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 
            bg-primary hover:bg-primary-dark disabled:bg-primary/50 
            text-white font-semibold py-2.5 rounded-lg text-sm 
            transition-colors mt-2"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-8">
        <Link to="/login" className="text-primary hover:underline font-medium">
          Back to Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ResetPassword;