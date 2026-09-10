// src/services/locationService.js
import axios from "axios";

// Reverse geocode coordinates to get city, zone, and full address
export const reverseGeocode = async (lat, lng) => {
  try {
    const res = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat,
          lon: lng,
          format: "json",
          addressdetails: 1,
        },
        headers: { "Accept-Language": "en" },
      }
    );

    const addr = res.data.address || {};

    return {
      city: addr.city || addr.town || addr.county || "",
      zone:
        addr.suburb ||
        addr.neighbourhood ||
        addr.quarter ||
        addr.residential ||
        "",
      fullAddress: res.data.display_name || "",
    };
  } catch (err) {
    console.error("Reverse geocode error:", err);
    return { city: "", zone: "", fullAddress: "" };
  }
};