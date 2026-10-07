// delivery-frontend/src/components/common/LocationPicker.jsx
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import toast from "react-hot-toast";
import { MapPin } from "lucide-react";
import { updateLocationAndRadius, getLocationAndRadius } from "../../services/locationService";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const PRESET_RADII = [2, 5, 10, 15];
const MAX_RADIUS = 20;

const LocationMarker = ({ position, onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return position ? <Marker position={position} /> : null;
};

const LocationPicker = () => {
  const [position, setPosition] = useState(null);
  const [radius, setRadius] = useState(5);
  const [customRadius, setCustomRadius] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const data = await getLocationAndRadius();
        if (data.currentLocation?.lat) {
          setPosition([data.currentLocation.lat, data.currentLocation.lng]);
        }
        if (data.deliveryRadius) setRadius(data.deliveryRadius);
      } catch (err) {
        console.error("Failed to load saved location:", err);
      }
    };
    fetchExisting();
  }, []);

  const handleSave = async () => {
    if (!position) {
      toast.error("Please pin your location on the map first.");
      return;
    }
    if (radius <= 0 || radius > MAX_RADIUS) {
      toast.error(`Radius must be between 1 and ${MAX_RADIUS} km.`);
      return;
    }
    setIsSaving(true);
    try {
      await updateLocationAndRadius(position[0], position[1], radius);
      toast.success("Delivery range updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save range.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-primary/90 shadow-sm p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={16} className="text-primary" />
        <p className="text-sm font-semibold text-gray-800">Set Your Delivery Range</p>
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-200 mb-3">
        <MapContainer
          center={position || [32.1877, 74.1945]}
          zoom={12}
          style={{ height: "180px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} onSelect={(lat, lng) => setPosition([lat, lng])} />
        </MapContainer>
      </div>

      <p className="text-xs text-gray-400 mb-3">Click on the map to set your current location</p>

      <div className="flex gap-2 mb-2 flex-wrap">
        {PRESET_RADII.map((km) => (
          <button
            key={km}
            onClick={() => { setRadius(km); setCustomRadius(""); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200
              ${radius === km ? "bg-primary text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
          >
            {km} km
          </button>
        ))}
        <input
          type="number"
          min="1"
          max={MAX_RADIUS}
          placeholder="Custom (km)"
          value={customRadius}
          onChange={(e) => {
            setCustomRadius(e.target.value);
            setRadius(Number(e.target.value));
          }}
          className="w-24 px-3 py-1.5 rounded-full text-xs border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full mt-2 py-2.5 bg-primary text-white text-sm font-semibold rounded-full
          hover:bg-primary-dark transition-colors duration-200 disabled:opacity-60"
      >
        {isSaving ? "Saving..." : `Save Range (${radius} km)`}
      </button>
    </div>
  );
};

export default LocationPicker;