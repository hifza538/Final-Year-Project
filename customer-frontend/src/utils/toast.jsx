// customer-frontend/src/utils/toast.js

import toast from "react-hot-toast";
import { CheckCircle2, XCircle } from "lucide-react";

// Custom-styled success toast used across the entire app for a consistent look
export const showSuccessToast = (message) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } bg-white shadow-lg rounded-xl border-l-4 border-primary
           px-4 py-3 flex items-center gap-3 max-w-sm w-full`}
      >
        <CheckCircle2 size={22} className="text-primary shrink-0" />
        <p className="text-sm font-medium text-gray-800">{message}</p>
      </div>
    ),
    { duration: 2500 }
  );
};

// Custom-styled error toast
export const showErrorToast = (message) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } bg-white shadow-lg rounded-xl border-l-4 border-red-500
           px-4 py-3 flex items-center gap-3 max-w-sm w-full`}
      >
        <XCircle size={22} className="text-red-500 shrink-0" />
        <p className="text-sm font-medium text-gray-800">{message}</p>
      </div>
    ),
    { duration: 3000 }
  );
};