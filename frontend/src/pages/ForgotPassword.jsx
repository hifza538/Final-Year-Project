import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import AuthInput from "../components/AuthInput";
import { forgotPassword } from "../api/authapi";

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Email input state
  const [email, setEmail] = useState("");

  // Loading state for button
  const [loading, setLoading] = useState(false);

  // Error message state
  const [error, setError] = useState("");

  // Handle forgot password form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);

      // Request OTP from backend
      await forgotPassword({ email });

      // Save email for OTP verification step
      localStorage.setItem("resetEmail", email);

      alert("OTP sent to your email!");
      navigate("/otp-verify");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Password Recovery"
      benefits={[
        "Quick and secure password reset",
        "OTP verification for safety",
        "Get back to ordering in minutes",
      ]}
    >
      <div className="rounded-[2rem] border border-white/10 bg-white/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-black text-slate-900">Reset Password</h3>
          <p className="mt-2 text-sm text-slate-500">
            Enter your email and we'll send you an OTP to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput
            icon={<Mail size={18} />}
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
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

export default ForgotPassword;