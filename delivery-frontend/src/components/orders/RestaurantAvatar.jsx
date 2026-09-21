// delivery-frontend/src/components/orders/RestaurantAvatar.jsx

const RestaurantAvatar = ({ name }) => {
  const initial = name?.charAt(0)?.toUpperCase() || "R";
  return (
    <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0 font-bold text-primary">
      {initial}
    </div>
  );
};

export default RestaurantAvatar;