// customer-frontend/src/components/address/AddressCard.jsx

import { MapPin, Pencil, Trash2, CheckCircle2 } from "lucide-react";

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
  return (
    <div
      className={`bg-white rounded-xl border p-4 ${
        address.isDefault ? "border-primary" : "border-gray-100"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-primary-light text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
            {address.label}
          </span>
          {address.isDefault && (
            <span className="flex items-center gap-1 text-xs text-primary font-medium">
              <CheckCircle2 size={12} />
              Default
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onEdit(address)}
            className="text-gray-400 hover:text-primary transition-colors duration-200"
            aria-label="Edit address"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(address._id)}
            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
            aria-label="Delete address"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="flex items-start gap-2 mt-3">
        <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="text-gray-800 font-medium">{address.fullName} — {address.phone}</p>
          <p className="text-gray-500 mt-0.5">{address.address}, {address.city}</p>
          {address.notes && <p className="text-gray-400 text-xs mt-0.5">{address.notes}</p>}
        </div>
      </div>

      {!address.isDefault && (
        <button
          onClick={() => onSetDefault(address)}
          className="text-xs font-medium text-primary hover:underline mt-3"
        >
          Set as default
        </button>
      )}
    </div>
  );
};

export default AddressCard;