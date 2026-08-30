// customer-frontend/src/pages/Signup.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { signupSchema } from "../utils/validationSchemas";
import { registerCustomer } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/common/FormInput";
import AuthLayout from "../components/layout/AuthLayout";

const Signup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const data = await registerCustomer(formData);
      login(data.user, data.token); // Auto-login right after successful signup
      showSuccessToast("Account created successfully!");
      setTimeout(() => { navigate("/");
         // Redirect to home after a short delay to allow toast to be seen
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed. Please try again.";
      showErrorToast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Create Account</h1>
          <p className="text-gray-500 text-sm mb-6">Sign up to start ordering</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormInput
            label="Full Name"
            placeholder="Enter Your Full Name"
            registration={register("fullName")}
            error={errors.fullName}
          />
          <FormInput
            label="Email"
            type="email"
            placeholder="Enter Your Email"
            registration={register("email")}
            error={errors.email}
          />
          <FormInput
            label="Phone Number"
            placeholder="Enter Your Phone Number"
            registration={register("phone")}
            error={errors.phone}
          />
          <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Password"
            type="password"
            placeholder="Password"
            registration={register("password")}
            error={errors.password}
          />
          <FormInput
            label="Confirm Password"
            type="password"
            placeholder="Confirm Password"
            registration={register("confirmPassword")}
            error={errors.confirmPassword}
          />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 bg-primary text-white font-semibold rounded-full
                       hover:bg-primary-dark transition-colors duration-200
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
    </AuthLayout>
  );
};

export default Signup;