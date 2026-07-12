// customer-frontend/src/pages/Signup.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { signupSchema } from "../utils/validationSchemas";
import { registerCustomer } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/common/FormInput";

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
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
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
          <FormInput
            label="Password"
            type="password"
            placeholder="Enter Your Password"
            registration={register("password")}
            error={errors.password}
          />
          <FormInput
            label="Confirm Password"
            type="password"
            placeholder="Enter Your Password Again"
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
  );
};

export default Signup;