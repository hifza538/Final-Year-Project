import React, { useState } from "react";
import API from "../api/axios";

const RestaurantForm = ({ onRestaurantAdded }) => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    contactNumber: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
await API.post("/restaurants", form, {
  headers: { Authorization: `Bearer ${userInfo?.token}` },
});

      alert("Restaurant added successfully!");
      onRestaurantAdded();
      setForm({ name: "", address: "", contactNumber: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Error adding restaurant!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
      <input name="contactNumber" placeholder="Contact" value={form.contactNumber} onChange={handleChange} required />
      <button type="submit">Add Restaurant</button>
    </form>
  );
};

export default RestaurantForm;
