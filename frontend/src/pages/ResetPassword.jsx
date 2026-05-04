import { useEffect, useState } from "react";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import AuthInput from "../components/AuthInput";
import { resetPassword } from "../api/authapi";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Required data from previous steps
  const email = localStorage.getItem("resetEmail");
  const otp = localStorage.getItem("resetOtp");


  /*       Redirect back if user directly opens reset page without flow         */
  useEffect(() => {
    if (!email || !otp) {
      navigate("/forgot-password");
    }
  }, [email, otp, navigate]);

  // Update form state
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  // Submit reset password request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        email,
        otp,
        newPassword: formData.newPassword,
      });

      // Clear password reset temporary data
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetOtp");

      alert("Password reset successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create new password"
      subtitle="Password Reset"
      benefits={[
        "Set a strong new password",
        "Secure account recovery",
        "Get back to ordering quickly",
      ]}
    >
      <div className="rounded-[2rem] border border-white/10 bg-white/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-black text-slate-900">New Password</h3>
          <p className="mt-2 text-sm text-slate-500">
            Create a strong password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            icon={<Lock size={18} />}
            type={showPassword ? "text" : "password"}
            name="newPassword"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={handleChange}
            error={error}
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

          <AuthInput
            icon={<Lock size={18} />}
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm new password"
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

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Resetting..." : "Reset Password"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Remember your password?
          <span
            onClick={() => navigate("/login")}
            className="ml-1 cursor-pointer font-semibold text-orange-500 hover:underline"
          >
            Back to login
          </span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;