import React, { useState, useEffect } from "react";
import API from "../api/axios";

const MenuForm = ({ restaurantId, onMenuAdded }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/menus", { ...form, restaurantId });
      alert("✅ Menu item added successfully!");
      onMenuAdded();
      setForm({ name: "", description: "", price: "", category: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Error adding menu item!");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
      <h3>Add Menu Item</h3>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        required
      />
      <input
        name="category"
        placeholder="Category (e.g. Burger, Pizza)"
        value={form.category}
        onChange={handleChange}
        required
      />
      <button type="submit">Add Item</button>
    </form>
  );
};

export default MenuForm;
