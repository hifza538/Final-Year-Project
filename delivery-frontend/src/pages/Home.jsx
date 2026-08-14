import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.fullName?.split(" ")[0]}
        </h1>
        <button
          onClick={logout}
          className="text-sm font-medium text-gray-500 hover:text-primary transition-colors"
        >
          Logout
        </button>
      </div>

      {!user?.isApproved && (
        <div className="bg-primary-light border border-primary/20 text-primary-dark rounded-lg p-4 mb-6 text-sm">
          Your account is pending admin approval. You'll be notified once approved.
        </div>
      )}

      <p className="text-gray-500">
        Rider dashboard will be built here - assigned orders, delivery status, earnings.
      </p>
    </div>
  );
};

export default Home;
