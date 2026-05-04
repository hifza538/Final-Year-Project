// src/components/RestaurantSection.jsx
import React, { useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import { getAllRestaurants } from "../../api/restaurantApi";

const RestaurantSection = () => {
  /* -------------------------------------------------------------------------- */
  /*                                   States                                   */
  /* -------------------------------------------------------------------------- */

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  /* -------------------------------------------------------------------------- */
  /*                              Fetch Restaurants                             */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setPageError("");

        const res = await getAllRestaurants();

        // Backend response format:
        // { count: number, restaurants: [...] }
        setRestaurants(res.data.restaurants || []);
      } catch (error) {
        setPageError(
          error?.response?.data?.message || "Failed to load restaurants"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                               Loading State                                */
  /* -------------------------------------------------------------------------- */

  if (loading) {
    return (
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-orange-500">
              Nearby Favorites
            </p>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
              Popular Restaurants Near You
            </h2>
            <p className="mt-3 text-slate-500">
              Handpicked local vendors people are loving right now.
            </p>
          </div>

          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
              <p className="mt-4 font-medium text-slate-600">
                Loading restaurants...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                Error State                                 */
  /* -------------------------------------------------------------------------- */

  if (pageError) {
    return (
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
            <h3 className="text-2xl font-bold text-slate-900">
              Unable to load restaurants
            </h3>
            <p className="mt-3 text-slate-600">{pageError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                               Main Render                                  */
  /* -------------------------------------------------------------------------- */

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-orange-500">
            Nearby Favorites
          </p>
          <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
            Popular Restaurants Near You
          </h2>
          <p className="mt-3 text-slate-500">
            Handpicked local vendors people are loving right now.
          </p>
        </div>

        {restaurants.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900">
              No restaurants found
            </h3>
            <p className="mt-3 text-slate-500">
              Please check back later for available food spots.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RestaurantSection;