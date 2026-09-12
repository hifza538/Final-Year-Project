import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const LocationMarker = ({ position, onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return position ? <Marker position={position} /> : null;
};

const MapPicker = ({ initialLat, initialLng, onLocationSelect }) => {
  const [position, setPosition] = useState(
    initialLat && initialLng ? [initialLat, initialLng] : null
  );
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState("");

  const defaultCenter = position || [32.1877, 74.1945];

  const handleSelect = (lat, lng) => {
    setError("");
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
  };

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Location detection is not supported in this browser.");
      return;
    }
    setError("");
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleSelect(pos.coords.latitude, pos.coords.longitude);
        setDetecting(false);
      },
      () => {
        setError("Could not access your location. Please pin it manually on the map.");
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg mb-2">
          {error}
        </div>
      )}

      <div className="rounded-lg overflow-hidden border border-gray-200">
        <MapContainer center={defaultCenter} zoom={13} style={{ height: "220px", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} onSelect={handleSelect} />
        </MapContainer>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Click on the map or use current location to pin your delivery address
      </p>
    </div>
  );
};

export default MapPicker;

