import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { loginSchema } from "../utils/validationSchemas";
import { loginDelivery } from "../services/authService";
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
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const data = await loginDelivery(formData);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.fullName.split(" ")[0]}!`);
      navigate("/");
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      {/* Logo shown only on mobile/tablet since left branding panel is hidden there */}
      <div className="lg:hidden flex items-center gap-1 mb-6 justify-center">
        <span className="text-xl font-bold text-primary">Local</span>
        <span className="text-xl font-bold text-gray-900">Bites</span>
        <span className="text-sm text-gray-400 ml-1">Rider</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back</h1>
        <p className="text-gray-500 text-sm mb-6">Log in to continue accepting deliveries</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormInput
            label="Email"
            type="email"
            placeholder="abc@gmail.com"
            registration={register("email")}
            error={errors.email}
          />
          <FormInput
            label="Password"
            type="password"
            placeholder="password"
            registration={register("password")}
            error={errors.password}
          />

          <div className="flex justify-end -mt-2 mb-2">
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

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
          New rider?{" "}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;