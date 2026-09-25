// customer-frontend/src/components/home/Hero.jsx

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Star } from "lucide-react";

const MAX_TILES = 4;

const HeroTile = ({ restaurant }) => (
  <Link
    to={`/restaurant/${restaurant._id}`}
    className="group relative block aspect-[4/5] rounded-2xl overflow-hidden bg-white/10"
  >
    <img
      src={restaurant.coverPhoto}
      alt={restaurant.shopName}
      loading="lazy"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

    {restaurant.averageRating ? (
      <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-semibold text-secondary">
        <Star size={12} className="fill-primary text-primary" />
        {restaurant.averageRating}
      </span>
    ) : null}

    <div className="absolute inset-x-0 bottom-0 p-3 text-white">
      <p className="font-semibold text-sm leading-tight truncate">{restaurant.shopName}</p>
      <p className="text-xs text-white/80 truncate mt-0.5">
        {restaurant.isOpen ? (restaurant.cuisines?.join(", ") || restaurant.cuisine) : "Closed right now"}
      </p>
    </div>
  </Link>
);

// Hero section with headline, search bar and featured restaurants
const Hero = ({ searchTerm, onSearchChange, restaurantCount, isLoading, restaurants = [] }) => {
  // Open restaurants first, then best rated. Only ones that actually have a cover photo.
  const featured = useMemo(
    () =>
      restaurants
        .filter((r) => r.coverPhoto)
        .sort((a, b) => {
          if (a.isOpen !== b.isOpen) return a.isOpen ? -1 : 1;
          return (b.averageRating || 0) - (a.averageRating || 0);
        })
        .slice(0, MAX_TILES),
    [restaurants]
  );

  const openCount = restaurants.filter((r) => r.isOpen).length;
  const showSkeleton = isLoading && restaurants.length === 0;
  const showMosaic = featured.length >= 2;

  // Two staggered columns
  const columnA = featured.filter((_, i) => i % 2 === 0);
  const columnB = featured.filter((_, i) => i % 2 === 1);

  return (
    <section className="relative overflow-hidden bg-[#C2410C]">
      {/* One quiet shape behind the photos */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-white/10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div
          className={`grid gap-12 items-center ${
            showMosaic || showSkeleton ? "lg:grid-cols-[1.1fr_0.9fr]" : ""
          }`}
        >
          {/* Left: headline + search */}
          <div className="animate-hero-in">
            <h1 className="text-2xl sm:text-3xl lg:text-6xl font-black text-white leading-[1.02] tracking-tight max-w-xl">
              Order food from your favorite local restaurants
            </h1>
            <p className="text-orange-50 text-lg mt-5 max-w-md">
              From local favorites to hidden gems, find the perfect meal for any craving.
            </p>

            <div className="relative mt-8 max-w-lg">
              <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search restaurants by name"
                aria-label="Search restaurants"
                className="w-full h-14 pl-14 pr-5 rounded-full bg-white text-secondary text-base
                           placeholder:text-gray-400 shadow-lg shadow-black/10
                           focus:outline-none focus:ring-4 focus:ring-white/40 transition-shadow"
              />
            </div>

            <p className="mt-4 h-6 text-sm text-orange-50">
              {!isLoading && (
                <>
                  <span className="font-semibold text-white">{restaurantCount}</span>{" "}
                  restaurant{restaurantCount !== 1 ? "s" : ""} ready to deliver to you
                  {openCount > 0 ? `, ${openCount} open now` : ""}
                </>
              )}
            </p>
          </div>

          {/* Right: real restaurants */}
          {(showMosaic || showSkeleton) && (
            <div className="hidden lg:grid grid-cols-2 gap-4 w-full max-w-sm ml-auto animate-hero-in-delayed">
              {showSkeleton ? (
                <>
                  <div className="space-y-4">
                    <div className="aspect-[4/5] rounded-2xl bg-white/15 animate-pulse" />
                    <div className="aspect-[4/5] rounded-2xl bg-white/15 animate-pulse" />
                  </div>
                  <div className="space-y-4 mt-10">
                    <div className="aspect-[4/5] rounded-2xl bg-white/15 animate-pulse" />
                    <div className="aspect-[4/5] rounded-2xl bg-white/15 animate-pulse" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    {columnA.map((r) => (
                      <HeroTile key={r._id} restaurant={r} />
                    ))}
                  </div>
                  <div className="space-y-4 mt-10">
                    {columnB.map((r) => (
                      <HeroTile key={r._id} restaurant={r} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;