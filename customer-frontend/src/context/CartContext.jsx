// customer-frontend/src/context/CartContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // Load cart items from localStorage, cart persists across page refresh
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("customerCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Load restaurantId from localStorage, to ensure items are from the same restaurant
  const [restaurantId, setRestaurantId] = useState(() => {
    return localStorage.getItem("customerCartRestaurantId") || null;
  });

  // Whenever cartItems change, update localStorage to persist cart state
  useEffect(() => {
    localStorage.setItem("customerCart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (item, itemRestaurantId) => {
    // warn user if they are trying to add items from a different restaurant
    if (restaurantId && restaurantId !== itemRestaurantId && cartItems.length > 0) {
      toast.error("Aap dusre restaurant se item add kar rahe hain. Pehle cart clear karein.");
      return;
    }

    setRestaurantId(itemRestaurantId);
    localStorage.setItem("customerCartRestaurantId", itemRestaurantId);

    setCartItems((prev) => {
      const existingItem = prev.find((i) => i._id === item._id);
      if (existingItem) {
        // item already exists in cart, increase quantity
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // new item, add to cart
      return [...prev, { ...item, quantity: 1 }];
    });

    toast.success(`${item.name} cart mein add ho gaya`);
  };

  // update item quantity in cart
  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((i) => (i._id === itemId ? { ...i, quantity } : i))
    );
  };

  // remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updated = prev.filter((i) => i._id !== itemId);
      if (updated.length === 0) {
        setRestaurantId(null);
        localStorage.removeItem("customerCartRestaurantId");
      }
      return updated;
    });
  };

  // clear entire cart
  const clearCart = () => {
    setCartItems([]);
    setRestaurantId(null);
    localStorage.removeItem("customerCartRestaurantId");
  };

  // delivered values for cart total and item count
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        restaurantId,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};