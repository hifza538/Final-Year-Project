// vendor-frontend/src/pages/ForgotPassword.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, CheckCircle2 } from "lucide-react";
import InputField from "../components/common/InputField";
import AuthLayout from "../components/layout/AuthLayout";
import {forgotPassword} from "../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setFieldError(err);
      return;
    }

    setLoading(true);
    setError("");
    try {
      await forgotPassword(email.trim().toLowerCase());
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthLayout
        heading={<>Check your<br />email inbox.</>}
        subtext="We've sent you a link to reset your password."
      >
        <div className="text-center">
          <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={26} className="text-primary" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Check Your Email</h1>
          <p className="text-gray-500 text-sm">
            If an account with that email exists, we've sent a password reset link. It will expire in 30 minutes.
          </p>
          <Link to="/login" className="inline-block mt-6 text-primary font-medium hover:underline text-sm">
            Back to Login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      heading={<>Forgot your<br />password?</>}
      subtext="No worries — we'll send you a reset link to your registered email."
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot Password</h1>
      <p className="text-gray-500 text-sm mb-8">
        Enter your email and we'll send you a reset link.
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
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setFieldError("");
          }}
          type="email"
          placeholder="Enter Your Email"
          required
          error={fieldError}
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
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-8">
        Remembered your password?{" "}
        <Link to="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;