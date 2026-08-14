// customer-frontend/src/pages/Profile.jsx

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Phone, Pencil, Plus, MapPin } from "lucide-react";
import { profileUpdateSchema } from "../utils/validationSchemas";
import { updateProfile } from "../services/authService";
import { getAddresses, addAddress, updateAddress, deleteAddress } from "../services/addressService";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/common/FormInput";
import AddressCard from "../components/address/AddressCard";
import AddressFormModal from "../components/address/AddressFormModal";
import EmptyState from "../components/common/EmptyState";
import { showSuccessToast, showErrorToast } from "../utils/toast";

const InfoField = ({ label, value, icon: Icon }) => (
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
      <Icon size={16} className="text-gray-500" />
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-sm text-gray-800 font-medium mt-0.5">{value}</p>
    </div>
  </div>
);

const Profile = () => {
  const { user, login, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Addresses state
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressSubmitting, setAddressSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: { fullName: user?.fullName || "", phone: user?.phone || "" },
  });

  const fetchAddresses = async () => {
    setAddressesLoading(true);
    try {
      const data = await getAddresses();
      setAddresses(data.addresses);
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    } finally {
      setAddressesLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const startEditing = () => {
    reset({ fullName: user?.fullName || "", phone: user?.phone || "" });
    setIsEditing(true);
  };

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const data = await updateProfile(formData);
      login(data.user, token);
      showSuccessToast("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddressSubmit = async (formData) => {
    setAddressSubmitting(true);
    try {
      if (editingAddress) {
        await updateAddress(editingAddress._id, formData);
        showSuccessToast("Address updated");
      } else {
        await addAddress(formData);
        showSuccessToast("Address added");
      }
      await fetchAddresses();
      setShowAddressModal(false);
      setEditingAddress(null);
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Failed to save address");
    } finally {
      setAddressSubmitting(false);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteAddress(addressId);
      showSuccessToast("Address removed");
      fetchAddresses();
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Failed to delete address");
    }
  };

  const handleSetDefault = async (address) => {
    try {
      await updateAddress(address._id, { isDefault: true });
      fetchAddresses();
    } catch (err) {
      showErrorToast("Failed to set default address");
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-8">
      {/* Personal Info Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          {!isEditing && (
            <button
              onClick={startEditing}
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-200"
            >
              <Pencil size={14} />
              Edit
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          {!isEditing ? (
            <div className="space-y-5">
              <InfoField label="Full Name" value={user?.fullName} icon={User} />
              <InfoField label="Email" value={user?.email} icon={Mail} />
              <InfoField label="Phone Number" value={user?.phone} icon={Phone} />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <FormInput label="Full Name" placeholder="Your full name" registration={register("fullName")} error={errors.fullName} />
              <FormInput label="Phone Number" placeholder="03001234567" registration={register("phone")} error={errors.phone} />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Saved Addresses Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MapPin size={20} />
            Saved Addresses
          </h2>
          <button
            onClick={() => {
              setEditingAddress(null);
              setShowAddressModal(true);
            }}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-200"
          >
            <Plus size={14} />
            Add New
          </button>
        </div>

        {addressesLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <EmptyState
            title="No saved addresses"
            message="Add an address to make checkout faster next time."
          />
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        )}
      </div>

      {showAddressModal && (
        <AddressFormModal
          initialData={editingAddress}
          onClose={() => {
            setShowAddressModal(false);
            setEditingAddress(null);
          }}
          onSubmit={handleAddressSubmit}
          isSubmitting={addressSubmitting}
        />
      )}
    </div>
  );
};

export default Profile;