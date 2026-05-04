import React from "react";
import Hero from "../components/home/Hero";
import CuisinesSection from "../components/home/CuisinesSection";
import RestaurantSection from "../components/home/RestaurantSection";
import VendorCTA from "../components//home/VendorCTA";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Hero />
      <CuisinesSection />
      <RestaurantSection />
      <VendorCTA />
      <Footer />
    </div>
  );
};

export default HomePage;