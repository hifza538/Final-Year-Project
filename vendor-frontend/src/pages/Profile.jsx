// vendor-frontend/src/pages/Profile.jsx

import { useEffect, useState } from "react";
import {
  Store, Phone, Mail, Clock, Truck,
  ShoppingBag, Pencil, Loader2, CheckCircle2,
  MapPin, User, UtensilsCrossed, Timer, Camera, Wallet,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Field from "../components/profile/Field";
import SectionCard from "../components/profile/SectionCard";
import StatPill from "../components/profile/StatPill";
import ProfileSkeleton from "../components/profile/ProfileSkeleton";
import EditProfileModal from "../components/profile/EditProfileModal";
import ErrorState from "../components/common/ErrorState";

const Profile = () => {
  const { user, login, token } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [saved, setSaved] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/vendor/profile");
      setVendor(data.vendor);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaved = (updated) => {
    setVendor(updated);
    login({ ...user, ...updated }, token);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const fmt12 = (t) => {
    if (!t) return "Not set";
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  const shopIsOpen = vendor?.isOpen ?? false;

  const handleToggleStatus = async () => {
    if (statusLoading) return;
    const nextStatus = !shopIsOpen;
    const prevVendor = vendor;

    setVendor((v) => ({ ...v, isOpen: nextStatus }));
    setStatusLoading(true);

    try {
      const { data } = await api.patch("/vendor/profile/status", {
        isOpen: nextStatus,
      });
      setVendor((v) => ({ ...v, isOpen: data.vendor?.isOpen ?? nextStatus }));
      login({ ...user, isOpen: nextStatus }, token);
    } catch (err) {
      setVendor(prevVendor);
      setError(err.response?.data?.message || "Failed to update shop status.");
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="space-y-5 max-w-3xl">

      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border 
          border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
          <CheckCircle2 size={16} />
          Profile updated successfully!
        </div>
      )}

      {error && <ErrorState message={error} onRetry={fetchProfile} />}

      {loading ? (
        <div className="space-y-4">
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array(2).fill(0).map((_, i) => (
              <ProfileSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : vendor ? (
        <>
          <div className="relative rounded-2xl overflow-hidden shadow-sm">
            <div
              className="h-48 sm:h-56 w-full relative bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center"
              style={
                vendor.coverPhoto?.url
                  ? {
                    backgroundImage: `url(${vendor.coverPhoto.url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                  : undefined
              }
            >
              {!vendor.coverPhoto?.url && (
                <UtensilsCrossed size={72} className="text-white/20" strokeWidth={1.5} />
              )}

              <button
                type="button"
                onClick={handleToggleStatus}
                disabled={statusLoading}
                title="Click to toggle shop status"
                className={`absolute top-4 left-4 flex items-center gap-1.5 
                  text-xs font-semibold px-3 py-1.5 rounded-full text-white 
                  transition-colors cursor-pointer disabled:opacity-70
                  ${shopIsOpen ? "bg-primary hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"}`}
              >
                {statusLoading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
                {shopIsOpen ? "Open Now" : "Closed"}
              </button>

              <button
                onClick={() => setShowEdit(true)}
                className="absolute top-4 right-4 flex items-center gap-2 
                  bg-black/40 hover:bg-black/55 backdrop-blur-sm text-white 
                  text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors"
              >
                <Camera size={14} />
                Change Cover
              </button>
            </div>

            <div className="bg-white px-6 pb-5 pt-0 flex items-end gap-4 -mt-10 relative">
              <div
                className="w-20 h-20 rounded-2xl bg-primary border-4 border-white 
                  shadow-md flex items-center justify-center text-white text-2xl 
                  font-bold flex-shrink-0 overflow-hidden"
              >
                {vendor.logo?.url ? (
                  <img src={vendor.logo.url} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  vendor.shopName?.[0]?.toUpperCase() || "V"
                )}
              </div>
              <div className="flex-1 min-w-0 pt-3">
                <p className="text-lg font-bold text-gray-900 truncate">
                  {vendor.shopName || "Shop name not set"}
                </p>
                <p className="text-sm text-gray-500">{vendor.fullName}</p>
              </div>
              <button
                onClick={() => setShowEdit(true)}
                className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-dark 
                  text-white text-sm font-semibold px-4 py-2 rounded-lg 
                  transition-colors shadow-sm flex-shrink-0"
              >
                <Pencil size={14} />
                Edit Profile
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowEdit(true)}
            className="sm:hidden w-full flex items-center justify-center gap-2 
              bg-primary hover:bg-primary-dark text-white text-sm font-semibold 
              px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <Pencil size={14} />
            Edit Profile
          </button>

          <div className="flex flex-wrap gap-3">
            <StatPill
              label="Hours"
              value={`${fmt12(vendor.openingTime)} - ${fmt12(vendor.closingTime)}`}
              icon={Clock}
            />
            <StatPill
              label="Prep Time"
              value={
                vendor.minPrepTime && vendor.maxPrepTime
                  ? `${vendor.minPrepTime}-${vendor.maxPrepTime} mins`
                  : "Not set"
              }
              icon={Timer}
            />
            <StatPill
              label="Delivery"
              value={vendor.serviceTypes?.delivery ? "Available" : "Unavailable"}
              icon={Truck}
            />
            <StatPill
              label="Pickup"
              value={vendor.serviceTypes?.pickup ? "Available" : "Unavailable"}
              icon={ShoppingBag}
            />
            <StatPill
              label="Delivery Fee"
              value={`Rs. ${vendor.deliveryFee ?? 50}`}
              icon={Wallet}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SectionCard title="Account Info" icon={User}>
              <Field label="Full Name" value={vendor.fullName} icon={User} />
              <Field label="Email" value={vendor.email} icon={Mail} />
              <Field label="Phone" value={vendor.phone} icon={Phone} />
            </SectionCard>

            <SectionCard title="Shop Details" icon={Store}>
              <Field label="Shop Name" value={vendor.shopName} icon={Store} />
              <Field label="Cuisine" value={vendor.cuisine} icon={UtensilsCrossed} />
              <Field label="Address" value={vendor.shopAddress} icon={MapPin} />
              <Field
                label="City / Zone"
                value={vendor.zone ? `${vendor.city} • ${vendor.zone}` : vendor.city}
                icon={MapPin}
              />
            </SectionCard>
          </div>
        </>
      ) : null}

      {showEdit && vendor && (
        <EditProfileModal
          vendor={vendor}
          onClose={() => setShowEdit(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

export default Profile;