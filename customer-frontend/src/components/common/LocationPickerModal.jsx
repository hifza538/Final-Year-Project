// customer-frontend/src/components/common/LocationPickerModal.jsx
 
import { useState } from "react";
import { Search, X } from "lucide-react";
import MapPicker from "./MapPicker";
import { searchLocation } from "../../services/locationService";
 
const LocationPickerModal = ({ initialCoordinates, initialLabel, onClose, onConfirm, onClear }) => {
  const [selected, setSelected] = useState(initialCoordinates || null); // { lat, lng } | null
  const [address, setAddress] = useState(initialLabel || "");
  const [resolvedAddress, setResolvedAddress] = useState(initialLabel || "");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
 
  const handleLocationSelect = (lat, lng) => {
    setSelected({ lat, lng });
    setAddress("");
    setResolvedAddress("");
    setSearchError("");
  };

  const handleAddressSearch = async (event) => {
    event.preventDefault();
    if (!address.trim()) {
      setSearchError("Enter an area, street, or city first.");
      return;
    }

    setSearching(true);
    setSearchError("");
    try {
      const result = await searchLocation(address.trim());
      handleLocationSelect(result.lat, result.lng);
      setAddress(result.label);
      setResolvedAddress(result.label);
    } catch (error) {
      setSearchError(error.message === "Location not found" ? error.message : "Could not search this location.");
    } finally {
      setSearching(false);
    }
  };
 
  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(selected.lat, selected.lng, resolvedAddress);
    onClose();
  };
 
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={18} />
        </button>
 
        <h3 className="text-base font-bold text-secondary mb-1">
          Set your delivery location
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Type your address, detect your location, or choose a point on the map.
        </p>

        <form onSubmit={handleAddressSearch} className="flex gap-2 mb-3">
          <input
            type="text"
            value={address}
            onChange={(event) => {
              setAddress(event.target.value);
              setResolvedAddress("");
            }}
            placeholder="Search area, street, or city"
            className="min-w-0 flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:border-primary"
            aria-label="Enter your location"
          />
          <button
            type="submit"
            disabled={searching}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-secondary text-white text-sm disabled:opacity-60"
          >
            <Search size={15} />
            {searching ? "Searching" : "Find"}
          </button>
        </form>

        {searchError && <p className="text-xs text-red-600 mb-2">{searchError}</p>}
 
        <MapPicker
          key={`${selected?.lat ?? initialCoordinates?.lat ?? "default"}-${selected?.lng ?? initialCoordinates?.lng ?? "default"}`}
          initialLat={selected?.lat ?? initialCoordinates?.lat}
          initialLng={selected?.lng ?? initialCoordinates?.lng}
          onLocationSelect={handleLocationSelect}
        />
 
        <button
          onClick={handleConfirm}
          disabled={!selected}
          className="w-full mt-4 py-2.5 rounded-lg bg-primary hover:bg-primary-dark
            text-white text-sm font-semibold transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {initialCoordinates ? "Change Location" : "Confirm Location"}
        </button>

        {initialCoordinates && (
          <button
            type="button"
            onClick={() => {
              onClear();
              onClose();
            }}
            className="w-full mt-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Remove location
          </button>
        )}
      </div>
    </div>
  );
};
 
export default LocationPickerModal;