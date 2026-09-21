// delivery-frontend/src/components/orders/DeliveryMapModal.jsx
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { X, MapPin } from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


const MapResizeFix = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
};

const DeliveryMapModal = ({ order, onClose }) => {
  const { coordinates, address, city, fullName, phone } = order.deliveryAddress || {};
  const hasPin = coordinates?.lat && coordinates?.lng;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Delivery Location</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {hasPin ? (
          <div className="h-64">
            <MapContainer
              center={[coordinates.lat, coordinates.lng]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <MapResizeFix />
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[coordinates.lat, coordinates.lng]} />
            </MapContainer>
          </div>
        ) : (
          <div className="h-40 flex flex-col items-center justify-center text-center bg-gray-50 px-4">
            <MapPin size={24} className="text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">
              No pinned location for this order so use the address below.
            </p>
          </div>
        )}

        <div className="p-5 space-y-1 text-sm">
          <p className="font-medium text-gray-800">{fullName}</p>
          <p className="text-gray-600">{address}, {city}</p>
          {phone && <p className="text-gray-500">{phone}</p>}
        </div>
      </div>
    </div>
  );
};

export default DeliveryMapModal;