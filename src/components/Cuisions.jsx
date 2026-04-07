import { useRef } from "react";

const cuisines = [
  { name: "Fast Food", img: "/fastfood.jpg" },
  { name: "Pizza", img: "/pizza.jpg" },
  { name: "Biryani", img: "/biryani.jpg" },
  { name: "Burgers", img: "/burger.jpg" },
  { name: "Pakistani", img: "/pakistani.jpg" },
  { name: "Paratha", img: "/paratha.jpg" },
  { name: "Desserts", img: "/dessert.jpg" },
  { name: "Chinese", img: "/chinese.jpg" },
];

const Cuisines = () => {
  const sliderRef = useRef(null);

  const scrollRight = () => {
    sliderRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="px-10 py-10 relative">

      <h2 className="text-2xl font-bold mb-6 text-center">Cuisines</h2>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-hidden scroll-smooth"
      >
        {cuisines.map((item, i) => (
          <div
            key={i}
            className="min-w-[160px] text-center"
          >
            <img
              src={item.img}
              className="w-36 h-36 rounded-xl object-cover mx-auto"
            />
            <p className="mt-3 text-orange-600 font-medium">
              {item.name}
            </p>
          </div>
        ))}
      </div>

      {/* NEXT BUTTON */}
      <button
        onClick={scrollRight}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-lg p-3 rounded-full"
      >
        ➡
      </button>
    </div>
  );
};

export default Cuisines;
