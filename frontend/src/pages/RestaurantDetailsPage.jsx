// src/pages/RestaurantDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";

import RestaurantBanner from "../components/restaurant/RestaurantBanner";
import RestaurantInfo from "../components/restaurant/RestaurantInfo";
import FavoriteButton from "../components/restaurant/FavoriteButton";
import MainTabs from "../components/restaurant/MainTabs";
import MenuSection from "../components/restaurant/MenuSection";
import ReviewsSection from "../components/restaurant/ReviewsSection";
import DealsSection from "../components/restaurant/DealsSection";
import Cart from "../components/cart/Cart";

// Context imports
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

// API import
import { getRestaurantById } from "../api/restaurantApi";

function RestaurantDetailsPage() {
  const { id } = useParams();

  /* -------------------------------------------------------------------------- */
  /*                                   States                                   */
  /* -------------------------------------------------------------------------- */

  // Restaurant data fetched from backend
  const [restaurant, setRestaurant] = useState(null);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Error state
  const [pageError, setPageError] = useState("");

  // UI states
  const [activeTab, setActiveTab] = useState("menu");
  const [isFavorited, setIsFavorited] = useState(false);

  // Reviews local state
  const [reviews, setReviews] = useState({
    average: 0,
    total: 0,
    items: [],
  });

  // Auth state
  const { isAuthenticated } = useAuth();

  // Cart state
  const {
    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  /* -------------------------------------------------------------------------- */
  /*                              Fetch Restaurant Data                         */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        setPageError("");

        const res = await getRestaurantById(id);
        const data = res.data;

        setRestaurant(data);

        // Set reviews separately so local UI review submit works
        setReviews(
          data.reviews || {
            average: 0,
            total: 0,
            items: [],
          }
        );
      } catch (error) {
        setPageError(
          error?.response?.data?.message || "Failed to load restaurant"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRestaurant();
    }
  }, [id]);

  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  // Redirect user to login page if they want to review
  const handleLogin = () => {
    window.location.href = "/login";
  };

  // Handle local review submission
  // Note: currently frontend-only UI update
  // Later backend review API se connect karenge
  const handleSubmitReview = (newReview) => {
    const reviewToAdd = {
      id: Date.now(),
      name: "You",
      rating: newReview.rating,
      date: "Just now",
      comment: newReview.comment,
      avatar: "",
    };

    setReviews((prev) => {
      const updatedItems = [reviewToAdd, ...prev.items];
      const updatedTotal = prev.total + 1;

      // Better average formula
      const updatedAverage =
        (prev.average * prev.total + reviewToAdd.rating) / updatedTotal;

      return {
        average: updatedAverage,
        total: updatedTotal,
        items: updatedItems,
      };
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                             Loading / Error UI                             */
  /* -------------------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 text-slate-600 font-medium">
              Loading restaurant...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="flex h-screen items-center justify-center px-4">
          <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900">
              Something went wrong
            </h2>
            <p className="mt-3 text-slate-600">{pageError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return <Navigate to="/" replace />;
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Restaurant banner */}
      <RestaurantBanner
        image={restaurant.bannerImage}
        name={restaurant.name}
      />

      {/* Main content */}
      <main className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 pb-12 md:px-6">
        {/* Restaurant info card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <RestaurantInfo
              data={{
                ...restaurant,
                reviewsCount: reviews.total,
                rating: reviews.average,
              }}
            />

            <div className="lg:flex lg:min-w-[260px] lg:justify-end">
              <FavoriteButton
                isFavorited={isFavorited}
                onToggle={() => setIsFavorited(!isFavorited)}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <MainTabs
            activeTab={activeTab}
            onTabClick={setActiveTab}
            menuCount={restaurant?.menu?.items?.length || 0}
            reviewsCount={reviews.total}
            dealsCount={restaurant?.deals?.length || 0}
          />
        </div>

        {/* Main grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left content */}
          <div className="lg:col-span-8">
            {activeTab === "menu" && (
              <MenuSection
                menu={
                  restaurant.menu || {
                    categories: [],
                    items: [],
                  }
                }
                restaurant={restaurant}
                onAddToCart={addToCart}
              />
            )}

            {activeTab === "reviews" && (
              <ReviewsSection
                reviews={reviews}
                isLoggedIn={isAuthenticated}
                onLogin={handleLogin}
                onSubmitReview={handleSubmitReview}
              />
            )}

            {activeTab === "deals" && (
              <DealsSection deals={restaurant.deals || []} />
            )}
          </div>

          {/* Right cart */}
          <div className="lg:col-span-4">
            <Cart
              cartItems={cartItems}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={removeFromCart}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default RestaurantDetailsPage;