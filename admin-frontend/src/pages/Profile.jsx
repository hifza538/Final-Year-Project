import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { updateProfile, changePassword } from "../services/settingsService";

const Profile = () => {
  const { user, login, token } = useAuth();

  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const data = await updateProfile(profileForm);
      // Refresh the stored user object so the navbar/sidebar show the new name immediately
      login(data.user, token);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirmation don't match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setIsSavingPassword(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success("Password changed successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary mb-1">Profile</h1>
        <p className="text-sm text-gray-500">Manage your account details and password.</p>
      </div>

      {/* Profile info */}
      <form onSubmit={handleProfileSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-secondary">Account Details</h2>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">Full Name</label>
          <input
            type="text"
            value={profileForm.fullName}
            onChange={(e) => setProfileForm((p) => ({ ...p, fullName: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">Phone</label>
          <input
            type="text"
            value={profileForm.phone}
            onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">Email</label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 text-gray-400"
          />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed here.</p>
        </div>

        <button
          type="submit"
          disabled={isSavingProfile}
          className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg
            hover:bg-primary-dark transition-colors disabled:opacity-60"
        >
          {isSavingProfile ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Password change */}
      <form onSubmit={handlePasswordSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-secondary">Change Password</h2>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">Current Password</label>
          <input
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">New Password</label>
          <input
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1.5">Confirm New Password</label>
          <input
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={isSavingPassword}
          className="w-full bg-secondary text-white font-semibold py-2.5 rounded-lg
            hover:bg-secondary-light transition-colors disabled:opacity-60"
        >
          {isSavingPassword ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default Profile;