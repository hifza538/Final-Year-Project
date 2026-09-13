// customer-frontend/src/context/LocationContext.jsx
 
import { createContext, useContext, useState } from "react";
import { reverseGeocode } from "../services/locationService";
 
const LocationContext = createContext();
 
// LocationProvider component that wraps the app and provides location state
export const LocationProvider = ({ children }) => {
  const [coordinates, setCoordinatesState] = useState(null); // { lat, lng } | null
  const [locationLabel, setLocationLabel] = useState("");
 
  const setLocation = async (lat, lng) => {
    setCoordinatesState({ lat, lng });
    setLocationLabel("Locating...");
 
    try {
      const geo = await reverseGeocode(lat, lng);
      const label = [geo.zone, geo.city].filter(Boolean).join(", ");
      setLocationLabel(label || "Location set");
    } catch {
      setLocationLabel("Location set");
    }
  };
 
  return (
    <LocationContext.Provider value={{ coordinates, locationLabel, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
 
export const useLocation = () => useContext(LocationContext);