// customer-frontend/src/pages/RestaurantDetail.jsx

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Clock, MapPin, UtensilsCrossed, Star } from "lucide-react";
import { getRestaurantMenu } from "../services/restaurantService";
import { getRestaurantReviews } from "../services/reviewService";
import ReviewsModal from "../components/reviews/ReviewsModal";
import MenuItemCard from "../components/restaurant/MenuItemCard";
import MenuItemSkeleton from "../components/restaurant/MenuItemSkeleton";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
    const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  

  const fetchMenu = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getRestaurantMenu(id);
      setRestaurant(data.restaurant);
      setItems(data.items);
    } catch (err) {
      console.error("Menu fetch error:", err);
      setError(err.response?.data?.message || "Failed to load menu. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getRestaurantReviews(id);
        setReviews(data.reviews);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };
    fetchReviews();
  }, [id]);

    const averageRating = useMemo(() => {
    if (reviews.length === 0) return null;
    const sum = reviews.reduce((total, r) => total + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  // Build the list of categories that actually have itemshow
  const categories = useMemo(() => {
    const unique = [...new Set(items.map((item) => item.category))];
    return ["All", ...unique];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="h-40 bg-gray-200 rounded-2xl animate-pulse mb-6" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <MenuItemSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ErrorState message={error} onRetry={fetchMenu} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Restaurant header */}
      <div className="relative h-40 sm:h-52 rounded-2xl overflow-hidden bg-gray-100 mb-6">
        {restaurant.coverPhoto ? (
          <img src={restaurant.coverPhoto} alt={restaurant.shopName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-light">
            <UtensilsCrossed size={40} className="text-primary/40" />
          </div>
        )}
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-secondary text-sm font-semibold px-4 py-2 rounded-full">
              Currently Closed
            </span>
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold text-gray-900">{restaurant.shopName}</h1>
      <p className="text-gray-500 mt-1">{restaurant.cuisine}</p>

      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <Clock size={16} />
          {restaurant.minPrepTime}-{restaurant.maxPrepTime} min
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={16} />
          {restaurant.zone}, {restaurant.city}
        </span>
        <button
          onClick={() => averageRating && setShowReviewsModal(true)}
          disabled={!averageRating}
          className={averageRating ? "flex items-center gap-1 font-medium text-gray-700 hover:text-primary transition-colors duration-200" : "text-gray-400 cursor-default"}
        >
          {averageRating ? (
            <>
              <Star size={16} className="fill-primary text-primary" />
              {averageRating} ({reviews.length})
            </>
          ) : (
            "No ratings yet"
          )}
        </button>
      </div>

      {/* Category filter tabs */}
      {categories.length > 1 && (
        <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200
                ${activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Menu items */}
      <div className="mt-6">
        {items.length === 0 ? (
          <EmptyState
            title="No menu items yet"
            message="This restaurant hasn't added any menu items yet. Check back soon."
          />
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <MenuItemCard key={item._id} item={item} restaurantId={restaurant._id} />
            ))}
          </div>
        )}
      </div>
      {showReviewsModal && (
        <ReviewsModal
          restaurantName={restaurant.shopName}
          reviews={reviews}
          averageRating={averageRating}
          onClose={() => setShowReviewsModal(false)}
        />
      )}
    </div>
  );
};

export default RestaurantDetail;