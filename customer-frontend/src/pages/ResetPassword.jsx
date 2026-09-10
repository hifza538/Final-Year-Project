// customer-frontend/src/pages/ResetPassword.jsx

import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../utils/validationSchemas";
import { resetPassword } from "../services/authService";
import FormInput from "../components/common/FormInput";
import AuthLayout from "../components/layout/AuthLayout";
import { showSuccessToast, showErrorToast } from "../utils/toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await resetPassword(token, formData.password);
      showSuccessToast("Password reset successful! Please log in.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      showErrorToast(err.response?.data?.message || "This reset link is invalid or has expired.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Set New Password</h1>
        <p className="text-gray-500 text-sm mb-6">Enter a new password for your account.</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormInput
            label="New Password"
            type="password"
            placeholder="Enter new password"
            registration={register("password")}
            error={errors.password}
          />
          <FormInput
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
            registration={register("confirmPassword")}
            error={errors.confirmPassword}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 bg-primary text-white font-semibold rounded-full
                       hover:bg-primary-dark transition-colors duration-200
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          <Link to="/login" className="text-primary font-medium hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;