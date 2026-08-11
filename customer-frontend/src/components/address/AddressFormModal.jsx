// customer-frontend/src/components/address/AddressFormModal.jsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { addressSchema } from "../../utils/validationSchemas";
import FormInput from "../common/FormInput";

const AddressFormModal = ({ initialData, onClose, onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: initialData?.label || "Home",
      fullName: initialData?.fullName || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      city: initialData?.city || "",
      notes: initialData?.notes || "",
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="font-bold text-gray-900">
            {initialData ? "Edit Address" : "Add New Address"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5" noValidate>
          <FormInput
            label="Label"
            placeholder="Home, Work, etc."
            registration={register("label")}
            error={errors.label}
          />
          <FormInput
            label="Full Name"
            placeholder="Receiver's name"
            registration={register("fullName")}
            error={errors.fullName}
          />
          <FormInput
            label="Phone Number"
            placeholder="enter phone number"
            registration={register("phone")}
            error={errors.phone}
          />
          <FormInput
            label="Address"
            placeholder="House number, street, area"
            registration={register("address")}
            error={errors.address}
          />
          <FormInput
            label="City"
            placeholder="Gujranwala"
            registration={register("city")}
            error={errors.city}
          />
          <FormInput
            label="Notes"
            placeholder="Any additional instructions"
            registration={register("notes")}
            error={errors.notes}
            required={false}
          />

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm text-gray-600
                         hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-full bg-primary text-white text-sm font-semibold
                         hover:bg-primary-dark transition-colors duration-200
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressFormModal;