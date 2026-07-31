// admin-frontend/src/pages/Dashboard.jsx

import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.fullName}
        </h1>
        <button
          onClick={logout}
          className="text-sm font-medium text-gray-500 hover:text-primary transition-colors"
        >
          Logout
        </button>
      </div>

      <p className="text-gray-500">
        Vendor approvals, delivery approvals, user management and stats will be built here.
      </p>
    </div>
  );
};

export default Dashboard;
