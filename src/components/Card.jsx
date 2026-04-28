const Card = ({ item }) => {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition">
      
      {/* Image */}
      <img
        src={item.img}
        alt={item.name}
        className="h-48 w-full object-cover rounded-t-2xl"
      />

      {/* Content */}
      <div className="p-5">

        {/* Title + Rating */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">{item.name}</h3>
          <p className="flex items-center gap-1 text-sm">
            ⭐ <span className="font-semibold">{item.rating}</span>
            <span className="text-gray-500">({item.reviews})</span>
          </p>
        </div>

        {/* Category */}
        <p className="text-orange-500 font-medium mt-1">
          {item.type}
        </p>

        {/* Info */}
        <div className="flex gap-4 text-sm text-gray-500 mt-3">
          <p>📍 {item.distance}</p>
          <p>⏱ {item.time}</p>
        </div>

        {/* Popular items */}
        <p className="mt-4 text-sm font-semibold">
          Popular items:
        </p>

        <div className="flex gap-2 flex-wrap mt-2">
          {item.popular.map((food, i) => (
            <span
              key={i}
              className="bg-gray-100 px-3 py-1 rounded-full text-sm"
            >
              {food}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-5">
          <button className="flex-1 bg-orange-500 text-white px-2 py-2 rounded">
            View Menu
          </button>

          <button className="flex-1 border-2 border-orange-500 text-orange-500 px-2 py-2 rounded">
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
