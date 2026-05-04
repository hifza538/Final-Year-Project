import React from "react";

const AuthInput = ({ icon, rightIcon, error, ...props }) => {
  return (
    <div>
      <div
        className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-slate-400 transition focus-within:ring-4 ${
          error
            ? "border-red-400 bg-red-50 focus-within:border-red-500 focus-within:ring-red-100"
            : "border-slate-200 bg-slate-50 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-orange-100"
        }`}
      >
        {/* Left icon */}
        {icon && <span className="shrink-0">{icon}</span>}

        {/* Input field */}
        <input
          {...props}
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />

        {/* Right icon (eye button etc) */}
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default AuthInput;