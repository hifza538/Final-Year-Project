import React from "react";
import { MapPin, Search } from "lucide-react";

const Hero = () => {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop&q=60')",
      }}
    >
      <div className="absolute inset-0 bg-slate-900/65"></div>

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mb-6 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
          Fresh • Fast • Local
        </div>

        <h2 className="max-w-4xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
          Discover Your <span className="text-yellow-400">Street Favorites</span>
        </h2>

        <p className="mt-5 max-w-2xl text-base text-slate-200 sm:text-lg">
          Connect with local food vendors, explore authentic street food, and
          order directly from your favorite spots.
        </p>

        <div className="mt-10 w-full max-w-5xl rounded-2xl bg-white p-4 shadow-2xl">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 md:col-span-4">
              <MapPin className="text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Enter your location"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 md:col-span-5">
              <Search className="text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Search food or restaurant"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>

            <button className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 md:col-span-3">
              Find Food
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600">
            Explore Restaurants
          </button>
          <button className="rounded-xl border border-white/50 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
            List Your Shop for Free
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;