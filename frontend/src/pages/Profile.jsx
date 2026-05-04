import { useEffect, useState } from "react";
import { getProfile } from "../api/authapi";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setUser(res.data.user);
      } catch (err) {
        console.error("Profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading profile...</p>
      </div>
    );
  }

  // agar user hi na mile
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-sm">Failed to load profile</p>
      </div>
    );
  }

  // safe split full name
  const nameParts = (user.fullName || "").trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* PROFILE SECTION */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-base font-semibold mb-4">My profile</h2>

          <div className="grid gap-4 sm:grid-cols-2">

            {/* FIRST NAME */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                First name
              </label>
              <input
                value={firstName}
                readOnly
                className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
              />
            </div>

            {/* LAST NAME */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Last name
              </label>
              <input
                value={lastName}
                readOnly
                className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Mobile number
              </label>
              <input
                value={user.phone ?? ""}
                placeholder="Not added"
                readOnly
                className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
              />
            </div>

          </div>
        </section>

        {/* EMAIL SECTION */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-base font-semibold mb-4">Email</h2>

          <label className="block text-xs font-medium text-gray-500 mb-1">
            Email
          </label>

          <input
            value={user.email || ""}
            readOnly
            className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
          />

          <span className="inline-flex mt-2 text-xs text-green-600 font-medium">
            ● Verified
          </span>
        </section>

        {/* PASSWORD SECTION */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-semibold mb-4">Password</h2>

          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Current password
              </label>
              <input
                value="********"
                readOnly
                className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                New password
              </label>
              <input
                placeholder="Coming soon"
                readOnly
                className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-400"
              />
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

export default Profile;