// customer-frontend/src/pages/Home.jsx

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { getAllRestaurants, getAvailableCuisines } from "../services/restaurantService";
import RestaurantCard from "../components/restaurant/RestaurantCard";
import RestaurantCardSkeleton from "../components/restaurant/RestaurantCardSkeleton";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCuisine, setActiveCuisine] = useState([]);

  // Fetch restaurants from the backend API, optionally filtered by search term
  const fetchRestaurants = useCallback(async (search = "", cuisine = "All") => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllRestaurants({ search, cuisine });
      setRestaurants(data.restaurants);
    } catch (err) {
      console.error("Restaurant fetch error:", err);
      setError(err.response?.data?.message || "Failed to load restaurants. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch available cuisines once on mount, for the filter chips
  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const data = await getAvailableCuisines();
        setCuisines(data.cuisines);
      } catch (err) {
        console.error("Cuisines fetch error:", err);
        // Silent fail is fine here — chips just won't show extra options, not a critical error
      }
    };
    fetchCuisines();
  }, []);

  // Debounce search input to avoid excessive API calls while typing
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRestaurants(searchTerm, activeCuisine);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, activeCuisine, fetchRestaurants]);

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

            {/* Cuisine filter chips — horizontally scrollable, built dynamically from real data */}
      {cuisines.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["All", ...cuisines].map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setActiveCuisine(cuisine)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 shrink-0
                ${
                  activeCuisine === cuisine
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <RestaurantCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <ErrorState message={error} onRetry={() => fetchRestaurants(searchTerm, activeCuisine)} />
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