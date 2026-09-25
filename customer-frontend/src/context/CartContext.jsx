// customer-frontend/src/context/CartContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import { showSuccessToast, showErrorToast } from "../utils/toast";

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
    const itemId = item?.itemId || item?._id || item?.id || "unknown-item";
    const variantId = item?.variantId || "";
    const addonIds = Array.isArray(item?.addonOptionIds) ? [...item.addonOptionIds].map(String).sort() : [];
    const cartKey = `${itemId}:${variantId}:${addonIds.join("|")}`;

    const normalizedItem = {
      ...item,
      _id: cartKey,
      itemId,
      variantId,
      addonOptionIds: addonIds,
      name: item?.name || item?.itemName || "Item",
      price: Number(item?.price ?? item?.unitPriceEstimate ?? 0),
      quantity: Number(item?.qty || item?.quantity || 1),
    };

    // warn user if they are trying to add items from a different restaurant
    if (restaurantId && restaurantId !== itemRestaurantId && cartItems.length > 0) {
      showErrorToast("you already have items from another restaurant in your cart. please clear it first");
      return;
    }

    setRestaurantId(itemRestaurantId);
    localStorage.setItem("customerCartRestaurantId", itemRestaurantId);

    setCartItems((prev) => {
      const existingItem = prev.find((i) => (i._id || i.itemId) === normalizedItem._id);
      if (existingItem) {
        return prev.map((i) =>
          (i._id || i.itemId) === normalizedItem._id
            ? { ...i, quantity: Number(i.quantity || 0) + Number(normalizedItem.quantity || 1) }
            : i
        );
      }

      return [...prev, { ...normalizedItem, quantity: Number(normalizedItem.quantity || 1) }];
    });

    showSuccessToast(`${normalizedItem.name} added to cart`);
  };

  // update item quantity in cart
  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((i) => ((i._id || i.itemId) === itemId ? { ...i, quantity } : i))
    );
  };

  // remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updated = prev.filter((i) => (i._id || i.itemId) !== itemId);
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