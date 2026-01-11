import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ➕ Add to cart
  const addToCart = (item) => {
    const exist = cartItems.find((x) => x._id === item._id);

    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x._id === item._id
            ? { ...x, quantity: x.quantity + 1 }
            : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  // ➕ Increase quantity
  const increaseQty = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // ➖ Decrease quantity
  const decreaseQty = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // ❌ Remove item
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x._id !== id));
  };

  // 🧹 Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQty,
        decreaseQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
