// admin-frontend/src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Check, LayoutDashboard, Store, Package, Users } from "lucide-react";
import { loginSchema } from "../utils/validationSchemas";
import { loginAdmin } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/common/FormInput";

// Features for the left panel of the login page
const features = [
  { icon: LayoutDashboard, text: "Real-time dashboard with key metrics" },
  { icon: Store, text: "Approve and manage vendor and delivery accounts" },
  { icon: Package, text: "Monitor all orders across the platform" },
  { icon: Users, text: "Customer management and insights" },
];

// Login component for the admin panel
const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false); 
  const { login } = useAuth();
  const navigate = useNavigate();
// Form handling with react-hook-form and zod for validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const data = await loginAdmin(formData);
      login(data.user, data.token);

      setLoginSuccess(true); 

      setTimeout(() => {
        navigate("/");
      }, 1400);

    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      
      {/* left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary flex-col justify-between px-16 py-14">
        <div>
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold text-primary">Local</span>
            <span className="text-xl font-bold text-white">Bites</span>
          </div>
          <p className="text-xs font-medium text-primary-light mt-0.5">
            Admin Panel
          </p>
        </div>

        <div className="max-w-md">
          <h1 className="text-3xl font-bold text-white leading-tight mb-4">
            Full control.
            <br />
            Complete visibility.
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed mb-8">
            Manage vendors, deliveries and customers with ease. Get real-time insights and make informed decisions to drive business forward.
          </p>

          <div className="flex flex-col gap-4">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-primary" />
                </div>
                <span className="text-sm text-gray-300">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-500">
          © 2026 LocalBites Admin. Restricted access.
        </p>
      </div>

      {/* right panel */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-14">
        <div className="w-full max-w-sm">

          {loginSuccess ? (
            // login success ui
            <div className="text-center py-4">
              <div
                className="rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4"
                style={{ width: 52, height: 52 }}
              >
                <Check size={26} className="text-primary" strokeWidth={2.5} />
              </div>
              <h2 className="text-lg font-bold text-secondary mb-1">
                You're logged in
              </h2>
              <p className="text-sm text-gray-400 mb-5">
                Taking you to the dashboard
              </p>
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-[fillbar_1.4s_ease-out_forwards]" />
              </div>
            </div>
          ) : (
            //  login form ui
            <>
            
              <h2 className="text-2xl font-bold text-secondary mb-1">
                Admin login
              </h2>
              <p className="text-sm text-gray-500 mb-7">
                Enter your credentials to access the admin panel.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormInput
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  registration={register("email")}
                  error={errors.email}
                />
                <FormInput
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
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
                  {isSubmitting ? "Logging in..." : "Log in"}
                </button>
              </form>

            
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;