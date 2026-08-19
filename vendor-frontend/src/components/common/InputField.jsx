// vendor-frontend/src/components/common/InputField.jsx

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const InputField = ({
  label, name, value, onChange, type = "text",
  placeholder, required, error, min,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
      <input
        type={inputType}
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
          focus:outline-none focus:ring-2 focus:ring-primary transition ${
            error ? "border-red-400 bg-red-50" : "border-gray-200"
          }`}
      />
      {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default InputField;