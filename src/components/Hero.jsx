const Hero = () => {
  return (
    <div
      className="h-[500px] bg-cover bg-center flex items-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/hero.jpg')",
      }}
    >
      <div className="max-w-4xl mx-auto text-center text-white">
        <h1 className="text-5xl font-bold">
          Discover Your{" "}
          <span className="text-yellow-400">Street Favorites</span>
        </h1>

        <p className="mt-4 text-gray-200">
          Connect with local food vendors, explore authentic street food,
          and order directly
        </p>

        {/* Search Box */}
        <div className="bg-white p-4 rounded-xl mt-8 flex gap-3">
          <input
            className="flex-1 border px-4 py-2 rounded"
            placeholder="Enter your location"
          />
          <input
            className="flex-1 border px-4 py-2 rounded"
            placeholder="Search food or restaurant"
          />
          <button className="bg-orange-500 text-white px-6 rounded">
            Find Food
          </button>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button className="bg-orange-500 text-white px-6 py-2 rounded">
            Explore Restaurants
          </button>
          <button className="border border-white px-6 py-2 rounded">
            List Your Shop for Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
