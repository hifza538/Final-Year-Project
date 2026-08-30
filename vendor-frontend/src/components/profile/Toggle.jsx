// vendor-frontend/src/components/profile/Toggle.jsx

// On/off switch used for service types (delivery, pickup)
const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-sm text-gray-700">{label}</span>
    <button
      type="button"
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 
        focus:outline-none ${checked ? "bg-primary" : "bg-gray-200"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full 
          shadow transition-transform duration-200 
          ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  </label>
);

export default Toggle;