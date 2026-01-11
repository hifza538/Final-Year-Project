import React, { useEffect, useState } from "react";
import API from "../api/axios";
import RestaurantForm from "../components/RestaurantForm";
import MenuForm from "../components/MenuForm";
import { useCart } from "../context/CartContext";

const Dashboard = () => {
  const { addToCart } = useCart();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [menus, setMenus] = useState([]);

  // 🟢 Fetch restaurants
  const fetchRestaurants = async () => {
    const { data } = await API.get("/restaurants");
    setRestaurants(data);
  };

  // 🟡 Fetch menu items
  const fetchMenus = async () => {
    const { data } = await API.get("/menus");
    setMenus(data);
  };

  useEffect(() => {
    fetchRestaurants();
    fetchMenus();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🍽️ Dashboard</h2>

      <h3>Your Restaurants</h3>
      <RestaurantForm onRestaurantAdded={fetchRestaurants} />

      <ul>
        {restaurants.map((r) => (
          <li key={r._id} onClick={() => setSelectedRestaurant(r._id)}>
            {r.name} — {r.address}
          </li>
        ))}
      </ul>

      {selectedRestaurant && (
        <>
          <MenuForm
            restaurantId={selectedRestaurant}
            onMenuAdded={fetchMenus}
          />
        </>
      )}

      <h3 style={{ marginTop: "2rem" }}>📜 All Menu Items</h3>
      <ul>
        {menus.map((m) => (
          <li key={m._id}>
            <strong>{m.name}</strong> — {m.category} — Rs.{m.price}
             <button
              style={{ marginLeft: "10px" }}
                onClick={() => addToCart(m)}
              >
               ➕ Add to Cart
      </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
