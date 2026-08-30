// form select component with label, error message and options
const FormSelect = ({ label, options, error, registration, required = true }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      <select
        required={required}
        {...registration}
        className={`w-full px-4 py-2.5 rounded-lg border bg-white transition-colors duration-200
          focus:outline-none focus:ring-2
          ${
            error
              ? "border-red-400 focus:ring-red-200"
              : "border-gray-300 focus:ring-primary/30 focus:border-primary"
          }`}
      >
        <option value="">Select vehicle type</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  );
};

export default FormSelect;
