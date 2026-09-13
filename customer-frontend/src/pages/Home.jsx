// customer-frontend/src/pages/Home.jsx
 
import { useState, useEffect, useCallback, useMemo } from "react";
import { getAllRestaurants } from "../services/restaurantService";
import RestaurantCard from "../components/restaurant/RestaurantCard";
import RestaurantCardSkeleton from "../components/restaurant/RestaurantCardSkeleton";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import Hero from "../components/home/Hero";
import CuisineCategories from "../components/home/CuisineCategories";
import TopRatedSection from "../components/home/TopRatedSection";
import { getActiveCategories } from "../services/CategoryService";
import { useLocation } from "../context/LocationContext";
 
const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCuisine, setActiveCuisine] = useState("All");
  const { coordinates } = useLocation();
 
  const fetchRestaurants = useCallback(async (search = "", cuisine = "All") => {
    setIsLoading(true);
    setError(null);
    try {
      const params = { search, cuisine };
      // Only send lat/lng once the customer has detected their location -
      // without it the backend just returns every approved restaurant
      if (coordinates) {
        params.lat = coordinates.lat;
        params.lng = coordinates.lng;
      }
      const data = await getAllRestaurants(params);
      setRestaurants(data.restaurants);
    } catch (err) {
      console.error("Restaurant fetch error:", err);
      setError(err.response?.data?.message || "Failed to load restaurants. Please try again.");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates]);
 
  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const data = await getActiveCategories();
        setCuisines(data.categories.map((cat) => cat.name));
      } catch (err) {
        console.error("Cuisines fetch error:", err);
      }
    };
    fetchCuisines();
  }, []);
 
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRestaurants(searchTerm, activeCuisine);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, activeCuisine, fetchRestaurants]);
 
  // Sort restaurants to show open ones first
  const sortedRestaurants = useMemo(() => {
    return [...restaurants].sort((a, b) => {
      if (a.isOpen === b.isOpen) return 0;
      return a.isOpen ? -1 : 1;
    });
  }, [restaurants]);
 
  return (
    <div>
      <Hero
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        restaurantCount={restaurants.length}
        isLoading={isLoading}
      />
 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!coordinates && (
          <div className="bg-primary-light border border-primary/20 text-secondary text-sm rounded-lg px-4 py-3 mb-6">
            Tip: use "Detect my location" in the navbar to see restaurants that actually deliver to you.
          </div>
        )}
 
        {cuisines.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-secondary mb-4">What are you craving?</h2>
            <CuisineCategories
              cuisines={cuisines}
              activeCuisine={activeCuisine}
              onSelect={setActiveCuisine}
            />
          </div>
        )}
 
        {!isLoading && !error && <TopRatedSection restaurants={restaurants} />}
 
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-secondary">
            {activeCuisine === "All" ? "Restaurants near you" : `${activeCuisine} restaurants`}
          </h2>
          {!isLoading && (
            <span className="text-sm text-gray-400">{restaurants.length} found</span>
          )}
        </div>
 
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
            title="No restaurants found"
            message="Try adjusting your search or check back later for new restaurants in your area."
          />
        )}
 
        {!isLoading && !error && restaurants.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {sortedRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
 
export default Home;