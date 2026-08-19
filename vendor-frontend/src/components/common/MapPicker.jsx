import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// set default marker icon for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Map par click hone par marker place karta hai
const LocationMarker = ({ position, onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const MapPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);
  const [detecting, setDetecting] = useState(false);

  // Default center: Karachi
  const defaultCenter = [24.8607, 67.0011];

  const handleSelect = (lat, lng) => {
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
  };

  // "Use my current location" button
  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleSelect(pos.coords.latitude, pos.coords.longitude);
        setDetecting(false);
      },
      () => {
        alert("Unable to retrieve your location.");
        setDetecting(false);
      }
    );
  };

  return (
    <div>
      <button
        type="button"
        onClick={detectCurrentLocation}
        disabled={detecting}
        className="mb-2 text-sm text-primary font-medium hover:underline disabled:opacity-50"
      >
        {detecting ? "Detecting..." : "Use my current location"}
      </button>

      <div className="rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={position || defaultCenter}
          zoom={13}
          style={{ height: "300px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} onSelect={handleSelect} />
        </MapContainer>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        click on the map to pin your shop's location
      </p>
    </div>
  );
};

export default MapPicker;