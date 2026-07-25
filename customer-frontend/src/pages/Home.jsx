// customer-frontend/src/pages/Home.jsx

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { getAllRestaurants } from "../services/restaurantService";
import RestaurantCard from "../components/restaurant/RestaurantCard";
import RestaurantCardSkeleton from "../components/restaurant/RestaurantCardSkeleton";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch restaurants from the backend API, optionally filtered by search term
  const fetchRestaurants = useCallback(async (search = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllRestaurants({ search });
      setRestaurants(data.restaurants);
    } catch (err) {
      console.error("Restaurant fetch error:", err);
      setError(err.response?.data?.message || "Failed to load restaurants. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce search input to avoid excessive API calls while typing
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRestaurants(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchRestaurants]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Restaurants near you</h1>
        <p className="text-gray-500 text-sm mt-1">
          {isLoading ? "Loading restaurants..." : `${restaurants.length} restaurants available`}
        </p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search restaurants by name..."
          className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                     transition-all duration-200"
        />
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <RestaurantCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <ErrorState message={error} onRetry={() => fetchRestaurants(searchTerm)} />
      )}

      {!isLoading && !error && restaurants.length === 0 && (
        <EmptyState
          title="No restaurants available yet"
          message="Try adjusting your search or check back later for new restaurants in your area."
        />
      )}

      {!isLoading && !error && restaurants.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;