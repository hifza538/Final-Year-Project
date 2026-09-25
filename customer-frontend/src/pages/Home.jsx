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
import VendorCta from "../components/home/VendorCta";
import { getActiveCuisines } from "../services/cuisineService";
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
  }, [coordinates]);

  useEffect(() => {
    // NOTE: this now fetches real Cuisine documents (Fast Food, Chinese, BBQ...),
    // not menu-item Category documents (Pizza, Burgers) which was the old bug.
    const fetchCuisines = async () => {
      try {
        const data = await getActiveCuisines();
        setCuisines(data.cuisines.map((c) => ({ name: c.name, image: c.image?.url || "" })));
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
        restaurants={sortedRestaurants}
        isLoading={isLoading}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 sm:space-y-14">
        {!coordinates && (
          <div className="bg-primary-light border border-primary/20 text-secondary text-sm rounded-lg px-4 py-3">
            Tip: use "Detect my location" in the navbar to see restaurants that actually deliver to you.
          </div>
        )}

        {cuisines.length > 0 && (
          <section className="py-1">
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-secondary tracking-tight">What are you craving?</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Browse by cuisine</p>
              </div>
            </div>
            <CuisineCategories
              cuisines={cuisines}
              activeCuisine={activeCuisine}
              onSelect={setActiveCuisine}
            />
          </section>
        )}

        {!isLoading && !error && <TopRatedSection restaurants={restaurants} />}

        <section>
          <div className="flex items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-secondary tracking-tight">
                  {activeCuisine === "All" ? "Restaurants Near You" : `${activeCuisine} Restaurants`}
                </h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {coordinates
                  ? "Sorted by distance from you and open status."
                  : "Showing all approved restaurants - enable location for a sorted list."}
              </p>
            </div>
            {!isLoading && (
              <span className="text-sm font-medium text-gray-500 shrink-0 bg-gray-50 px-3 py-1.5 rounded-full">
                {restaurants.length} found
              </span>
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
        </section>
      </div>

      <VendorCta />
    </div>
  );
};

export default Home;