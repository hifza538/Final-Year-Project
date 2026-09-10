// delivery-frontend/src/pages/Profile.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ArrowLeft, Pencil } from "lucide-react";
import { profileUpdateSchema } from "../utils/validationSchemas";
import { updateProfile } from "../services/profileService";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/common/FormInput";
import FormSelect from "../components/common/FormSelect";

const vehicleOptions = [
  { value: "bike", label: "Motorbike" },
  { value: "car", label: "Car" },
  { value: "bicycle", label: "Bicycle" },
];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      vehicleType: user?.vehicleType || "",
      vehicleNumber: user?.vehicleNumber || "",
    },
  });

  const handleEditClick = () => {
    // Reset form to current user data every time edit mode
    reset({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      vehicleType: user?.vehicleType || "",
      vehicleNumber: user?.vehicleNumber || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const data = await updateProfile(formData);
      updateUser(data.user);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      const message = error.response?.data?.message || "Update failed. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null; // PrivateRoute should handle redirecting to login if not authenticated

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              <Pencil size={15} />
              Edit
            </button>
          )}
        </div>

        {!isEditing ? (
          
          <div className="space-y-5">
            <ProfileField label="Full Name" value={user.fullName} />
            <ProfileField label="Email" value={user.email} readOnlyNote="Cannot be changed" />
            <ProfileField label="Phone Number" value={user.phone} />
            <ProfileField label="CNIC Number" value={user.cnicNumber} readOnlyNote="Cannot be changed" />
            <div className="grid grid-cols-2 gap-4">
              <ProfileField
                label="Vehicle Type"
                value={
                  vehicleOptions.find((opt) => opt.value === user.vehicleType)?.label ||
                  user.vehicleType
                }
              />
              <ProfileField label="Vehicle Number" value={user.vehicleNumber} />
            </div>
            <div className="pt-2">
              <span
                className={`inline-block text-xs font-medium px-3 py-1 rounded-full
                  ${user.isApproved ? "bg-green-50 text-green-600" : "bg-primary-light text-primary-dark"}`}
              >
                {user.isApproved ? "Approved Rider" : "Pending Approval"}
              </span>
            </div>
          </div>
        ) : (
          
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormInput
              label="Full Name"
              placeholder="John Doe"
              registration={register("fullName")}
              error={errors.fullName}
            />
            <FormInput
              label="Phone Number"
              placeholder="03001234567"
              registration={register("phone")}
              error={errors.phone}
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

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 py-2.5 border border-gray-300 text-gray-600 font-semibold rounded-full
                  hover:bg-gray-50 transition-colors duration-200 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-full
                  hover:bg-primary-dark transition-colors duration-200
                  disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// A simple component to display a profile field with optional read only note
const ProfileField = ({ label, value, readOnlyNote }) => (
  <div>
    <p className="text-xs font-medium text-gray-400 mb-1">{label}</p>
    <p className="text-gray-800">{value || "—"}</p>
    {readOnlyNote && <p className="text-xs text-gray-300 mt-0.5">{readOnlyNote}</p>}
  </div>
);

export default Profile;