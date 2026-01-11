import React from "react";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cartItems, removeFromCart, increaseQty, decreaseQty } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item._id} style={{ marginBottom: "15px" }}>
                <strong>{item.name}</strong> — Rs.{item.price}  
                <br />

                Quantity:
                <button onClick={() => decreaseQty(item._id)}> − </button>
                {item.quantity}
                <button onClick={() => increaseQty(item._id)}> + </button>

                <br />
                <button
                  style={{ marginTop: "5px" }}
                  onClick={() => removeFromCart(item._id)}
                >
                  ❌ Remove
                </button>
              </li>
            ))}
          </ul>

          <h3>Total: Rs. {total}</h3>
        </>
      )}
    </div>
  );
};

export default Cart;
