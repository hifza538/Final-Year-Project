// customer-frontend/src/components/common/FormInput.jsx
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// Reusable input field with built-in error message display
// Used across Login, Signup and future forms (Checkout, Profile etc.)
const FormInput = ({ label, type = "text", error, registration, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

    // If it's a password field and the user clicked "show", switch input type to text
  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>

      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
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

        {/* Eye icon toggle — only rendered for password fields */}
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                       hover:text-gray-600 transition-colors duration-200"
            tabIndex={-1} // Form ke tab order mein disturb na kare
             aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-1">{error.message}</p>
      )}
    </div>
      );
};

export default FormInput;