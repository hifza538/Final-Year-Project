import Card from "./Card";

const foods = [
  {
    name: "Tony's Street",
    rating: "4.8",
    reviews: 124,
    distance: "0.3 miles",
    time: "15-25 min",
    img: "/taco.jpg",
    popular: ["Fish Tacos", "Carnitas Bowl"],
  },
  {
    name: "Mama's Burger",
    rating: "4.6",
    reviews: 89,
    distance: "0.5 miles",
    time: "20-30 min",
    img: "/burger.jpg",
    popular: ["Cheese Burger", "Fries"],
  },
  {
    name: "Spice Garden",
    rating: "4.9",
    reviews: 203,
    distance: "0.7 miles",
    time: "25-35 min",
    img: "/indian.jpg",
    popular: ["Biryani", "Butter Chicken"],
  },
  {
    name: "Fresh Noodle",
    rating: "4.7",
    reviews: 156,
    distance: "0.4 miles",
    time: "20-30 min",
    img: "/noodle.jpg",
    popular: ["Ramen", "Dumplings"],
  },
  {
    name: "Wrap & Roll",
    rating: "4.5",
    reviews: 78,
    distance: "0.6 miles",
    time: "15-20 min",
    img: "/wrap.jpg",
    popular: ["Chicken Wrap"],
  },
  {
    name: "Grill House",
    rating: "4.6",
    reviews: 92,
    distance: "0.8 miles",
    time: "30-40 min",
    img: "/bbq.jpg",
    popular: ["Steak", "Wings"],
  },
    {
    name: "Grill House",
    rating: "4.6",
    reviews: 92,
    distance: "0.8 miles",
    time: "30-40 min",
    img: "/bbq.jpg",
    popular: ["Steak", "Wings"],
  },
    {
    name: "Grill House",
    rating: "4.6",
    reviews: 92,
    distance: "0.8 miles",
    time: "30-40 min",
    img: "/bbq.jpg",
    popular: ["Steak", "Wings"],
  },
];

const Popular = () => {
  return (
    <div className="px-10 py-14">

      {/* Header */}
      <div className="flex justify-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            Popular Near You
          </h2>
          <p className="text-gray-500">
            Trending food spots in your area
          </p>
        </div>
      </div>

      {/* GRID (2 Rows) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {foods.map((item, i) => (
          <Card key={i} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Popular;
