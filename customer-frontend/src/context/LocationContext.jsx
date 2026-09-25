// customer-frontend/src/context/LocationContext.jsx
 
import { createContext, useContext, useState } from "react";
import { reverseGeocode } from "../services/locationService";
 
const LocationContext = createContext();
const LOCATION_STORAGE_KEY = "localbitesDeliveryLocation";

const getSavedLocation = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(LOCATION_STORAGE_KEY));
    if (saved?.coordinates?.lat != null && saved?.coordinates?.lng != null) return saved;
  } catch {
    localStorage.removeItem(LOCATION_STORAGE_KEY);
  }
  return { coordinates: null, locationLabel: "" };
};
 
// LocationProvider component that wraps the app and provides location state
export const LocationProvider = ({ children }) => {
  const [savedLocation, setSavedLocation] = useState(getSavedLocation);
  const { coordinates, locationLabel } = savedLocation;
 
  const setLocation = async (lat, lng, label = "") => {
    const nextCoordinates = { lat, lng };
    setSavedLocation({ coordinates: nextCoordinates, locationLabel: label || "Locating..." });
    localStorage.setItem(
      LOCATION_STORAGE_KEY,
      JSON.stringify({ coordinates: nextCoordinates, locationLabel: label || "Locating..." })
    );

    if (label) return;
 
    try {
      const geo = await reverseGeocode(lat, lng);
      const label = [geo.zone, geo.city].filter(Boolean).join(", ");
      const nextLocation = { coordinates: nextCoordinates, locationLabel: label || "Location set" };
      setSavedLocation(nextLocation);
      localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(nextLocation));
    } catch {
      const nextLocation = { coordinates: nextCoordinates, locationLabel: "Location set" };
      setSavedLocation(nextLocation);
      localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(nextLocation));
    }
  };

  const clearLocation = () => {
    setSavedLocation({ coordinates: null, locationLabel: "" });
    localStorage.removeItem(LOCATION_STORAGE_KEY);
  };
 
  return (
    <LocationContext.Provider value={{ coordinates, locationLabel, setLocation, clearLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
 
export const useLocation = () => useContext(LocationContext);