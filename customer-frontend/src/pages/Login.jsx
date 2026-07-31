// customer-frontend/src/pages/Login.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { loginSchema } from "../utils/validationSchemas";
import { loginCustomer } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/common/FormInput";
import AuthLayout from "../components/layout/AuthLayout";

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Called when the form passes validation
  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const data = await loginCustomer(formData);
      login(data.user, data.token); // Save user + token in AuthContext
      showSuccessToast(`Welcome back, ${data.user.fullName.split(" ")[0]}!`);
      setTimeout(() => { navigate("/"); // Redirect to home after a short delay to allow toast to be seen
      }, 1500);
    } catch (error) {
      // Backend sends a descriptive message (e.g. "Invalid email or password")
      const message = error.response?.data?.message || "Login failed. Please try again.";
      showErrorToast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back</h1>
          <p className="text-gray-500 text-sm mb-6">Log in to continue ordering</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormInput
            label="Email"
            type="email"
            placeholder="Enter Your Email"
            registration={register("email")}
            error={errors.email}
          />
          <FormInput
            label="Password"
            type="password"
            placeholder="Enter Your Password"
            registration={register("password")}
            error={errors.password}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 bg-primary text-white font-semibold rounded-full
                       hover:bg-primary-dark transition-colors duration-200
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
    </AuthLayout>
  );
};

export default Login;