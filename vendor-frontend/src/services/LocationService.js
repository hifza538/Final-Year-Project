// src/services/locationService.js
import axios from "axios";



// List of major cities in Pakistan
const PAKISTAN_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Hyderabad",
  "Sialkot",
  "Gujranwala",
  "Bahawalpur",
  "Sargodha",
  "Sukkur",
  "Abbottabad",
];

// Fetch Pakistan cities from the predefined list
export const fetchPakistanCities = async () => {
  return PAKISTAN_CITIES;
};

// Fetch zones (suburbs/neighborhoods) for a given city using OpenStreetMap's Nominatim API
export const fetchZonesByCity = async (city) => {
  try {
    // Step 1: Get the bounding box for the city
    const cityRes = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: `${city}, Pakistan`,
          format: "json",
          limit: 1,
        },
        headers: {
          "Accept-Language": "en",
        },
      }
    );

    if (cityRes.data.length === 0) return [];

    const bbox = cityRes.data[0].boundingbox; 
    // bbox = [south, north, west, east]

    // Step 2: Fetch zones within the bounding box
    const zonesRes = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: `${city}`,
          format: "json",
          addressdetails: 1,
          limit: 40,
          viewbox: `${bbox[2]},${bbox[1]},${bbox[3]},${bbox[0]}`,
          bounded: 1,
          featuretype: "settlement",
        },
        headers: {
          "Accept-Language": "en",
        },
      }
    );

    // Step 3: Extract unique zone names
    const zonesSet = new Set();
    zonesRes.data.forEach((item) => {
      const name =
        item.address?.suburb ||
        item.address?.neighbourhood ||
        item.address?.quarter ||
        item.address?.town ||
        item.display_name.split(",")[0];
      
      if (name && name !== city) {
        zonesSet.add(name.trim());
      }
    });

    return Array.from(zonesSet).sort();
  } catch (err) {
    console.error("Zone fetch error:", err);
    return [];
  }
};