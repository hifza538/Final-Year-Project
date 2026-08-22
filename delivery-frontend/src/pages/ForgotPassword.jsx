// delivery-frontend/src/pages/ForgotPassword.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { forgotPasswordSchema } from "../utils/validationSchemas";
import { forgotPassword } from "../services/authService";
import FormInput from "../components/common/FormInput";
import { showSuccessToast, showErrorToast } from "../utils/toast";

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await forgotPassword(formData.email);
      setSubmitted(true);
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="bg-primary-light w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-xl font-bold text-primary">Local</span>
          <span className="text-xl font-bold text-gray-900">Bites</span>
          <span className="text-sm text-gray-400 ml-1">Rider</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Forgot Password</h1>
        <p className="text-gray-500 text-sm mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormInput
            label="Email"
            type="email"
            placeholder="Enter Your Email"
            registration={register("email")}
            error={errors.email}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 bg-primary text-white font-semibold rounded-full
                       hover:bg-primary-dark transition-colors duration-200
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Remembered your password?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;