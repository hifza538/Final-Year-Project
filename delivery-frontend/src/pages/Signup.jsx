import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { signupSchema } from "../utils/validationSchemas";
import { registerDelivery } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/common/FormInput";
import FormSelect from "../components/common/FormSelect";
import AuthLayout from "../components/layout/AuthLayout";

const vehicleOptions = [
  { value: "bike", label: "Motorbike" },
  { value: "car", label: "Car" },
  { value: "bicycle", label: "Bicycle" },
];

const Signup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const data = await registerDelivery(formData);
      login(data.user, data.token);
      toast.success("Registration submitted! Awaiting admin approval.");
      navigate("/");
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
    
      <div className="lg:hidden flex items-center gap-1 mb-6 justify-center">
        <span className="text-xl font-bold text-primary">Local</span>
        <span className="text-xl font-bold text-gray-900">Bites</span>
        <span className="text-sm text-gray-400 ml-1">Rider</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Rider Registration</h1>
        <p className="text-gray-500 text-sm mb-6">Join LocalBites as a delivery rider</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormInput
            label="Full Name"
            placeholder="Full Name"
            registration={register("fullName")}
            error={errors.fullName}
          />
          <FormInput
            label="Email"
            type="email"
            placeholder="abc@gmail.com"
            registration={register("email")}
            error={errors.email}
          />
          <FormInput
            label="Phone Number"
            placeholder="enter your phone number"
            registration={register("phone")}
            error={errors.phone}
          />
          <FormInput
            label="CNIC Number"
            placeholder="XXXXX-XXXXXXX-X"
            registration={register("cnicNumber")}
            error={errors.cnicNumber}
          />
           <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Vehicle Type"
            options={vehicleOptions}
            registration={register("vehicleType")}
            error={errors.vehicleType}
          />
          <FormInput
            label="Vehicle Number"
            placeholder="ABC-123"
            registration={register("vehicleNumber")}
            error={errors.vehicleNumber}
          />
 </div>
 <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Password"
            type="password"
            placeholder="password"
            registration={register("password")}
            error={errors.password}
          />
          <FormInput
            label="Confirm Password"
            type="password"
            placeholder="password"
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
            {isSubmitting ? "Submitting..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Already registered?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;