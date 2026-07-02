const InputField = ({
  label, name, value, onChange, type = "text",
  placeholder, required, error, min,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        onKeyDown={(e) => {
          if (type === "number" && ["-", "e", "E", "+"].includes(e.key)) {
            e.preventDefault();
          }
        }}
        className={`w-full px-4 py-2.5 rounded-lg border text-sm
          focus:outline-none focus:ring-2 focus:ring-pink-500 transition ${
            error ? "border-red-400 bg-red-50" : "border-gray-200"
          }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default InputField;