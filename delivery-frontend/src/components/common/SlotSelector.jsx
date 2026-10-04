// delivery-frontend/src/components/common/SlotSelector.jsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Clock } from "lucide-react";
import { selectSlot, getTodaySlot } from "../../services/statusService";

const SlotSelector = ({ onSlotChange }) => {
  const [slots, setSlots] = useState({});
  const [todaySlot, setTodaySlot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSlot = async () => {
      try {
        const data = await getTodaySlot();
        setSlots(data.slots);
        setTodaySlot(data.todaySlot);
        onSlotChange?.(data.todaySlot);
      } catch (err) {
        console.error("Failed to load slots:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSlot();
  }, [onSlotChange]);

  const handleSelect = async (slotName) => {
    try {
      const data = await selectSlot(slotName);
      setTodaySlot(data.todaySlot);
      onSlotChange?.(data.todaySlot);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not book slot.");
    }
  };

  if (isLoading) return null;

  return (
    <div className="bg-white rounded-xl border-2 border-primary/90 shadow-sm p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Clock size={16} className="text-primary" />
        <p className="text-sm font-semibold text-gray-800">Today's Delivery Slot</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(slots).map(([name, def]) => (
          <button
            key={name}
            onClick={() => handleSelect(name)}
            className={`py-2.5 px-2 rounded-lg text-xs font-medium transition-all duration-200 text-center
              ${
                todaySlot === name
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
          >
            <div className="font-semibold">{name}</div>
            <div className="text-[10px] opacity-80 mt-0.5">{def.label}</div>
          </button>
        ))}
      </div>
      {!todaySlot && (
        <p className="text-xs text-gray-400 mt-2">Book a slot to go online and receive orders.</p>
      )}
    </div>
  );
};

export default SlotSelector;