import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// form input component with label, error message and password visibility toggle
const FormInput = ({ label, type = "text", error, registration, placeholder, required = true }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          required={required}
          {...registration}
          className={`w-full px-4 py-2.5 rounded-lg border transition-colors duration-200
            focus:outline-none focus:ring-2
            ${isPasswordField ? "pr-11" : ""}
            ${
              error
                ? "border-red-400 focus:ring-red-200"
                : "border-gray-300 focus:ring-primary/30 focus:border-primary"
            }`}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                       hover:text-gray-600 transition-colors duration-200"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  );
};

export default FormInput;
