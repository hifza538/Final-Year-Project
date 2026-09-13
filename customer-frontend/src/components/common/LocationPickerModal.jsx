// customer-frontend/src/components/common/LocationPickerModal.jsx
 
import { useState } from "react";
import { X } from "lucide-react";
import MapPicker from "./MapPicker";
 
const LocationPickerModal = ({ onClose, onConfirm }) => {
  const [selected, setSelected] = useState(null); // { lat, lng } | null
 
  const handleLocationSelect = (lat, lng) => {
    setSelected({ lat, lng });
  };
 
  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(selected.lat, selected.lng);
    onClose();
  };
 
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl w-full max-w-md p-5 relative">
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
          Use your current location or pin it manually on the map.
        </p>
 
        <MapPicker onLocationSelect={handleLocationSelect} />
 
        <button
          onClick={handleConfirm}
          disabled={!selected}
          className="w-full mt-4 py-2.5 rounded-lg bg-primary hover:bg-primary-dark
            text-white text-sm font-semibold transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
};
 
export default LocationPickerModal;