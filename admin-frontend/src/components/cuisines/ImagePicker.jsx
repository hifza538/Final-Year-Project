//admin-frontend/src/components/categories/ImagePicker.jsx

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ImagePlus, X } from "lucide-react";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB, same as the server limit

// ImagePicker component for selecting and previewing an image file
const ImagePicker = ({ file, existingUrl = "", onSelect, onClear, required = false }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState("");

  // Preview for a newly chosen file
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const shown = preview || existingUrl;
  const canClear = required ? Boolean(file) : Boolean(shown);

  const handleChange = (e) => {
    const chosen = e.target.files?.[0];
    e.target.value = ""; // allow choosing the same file again
    if (!chosen) return;

    if (!ALLOWED_TYPES.includes(chosen.type)) {
      toast.error("Only JPG, PNG or WebP images are allowed");
      return;
    }
    if (chosen.size > MAX_SIZE) {
      toast.error("Image must be smaller than 2MB");
      return;
    }
    onSelect(chosen);
  };

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`w-12 h-12 rounded-lg border border-dashed bg-white flex items-center
          justify-center text-gray-400 hover:border-primary hover:text-primary overflow-hidden
          transition-colors ${
            required && !shown ? "border-red-300" : "border-gray-300"
          }`}
        aria-label={shown ? "Change image" : "Add image"}
        title={shown ? "Change image" : "Add image"}
      >
        {shown ? (
          <img src={shown} alt="" className="w-full h-full object-cover" />
        ) : (
          <ImagePlus size={18} />
        )}
      </button>

      {canClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white border border-gray-200
            text-gray-500 hover:text-red-500 flex items-center justify-center shadow-sm"
          aria-label={required ? "Cancel new image" : "Remove image"}
        >
          <X size={12} />
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};

export default ImagePicker;