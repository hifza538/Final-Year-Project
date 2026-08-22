import { PackageX } from "lucide-react";

// EmptyState component displays a message when there are no items to show (like no orders or no history etc.)
const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <PackageX size={40} className="text-gray-300 mb-3" />
    <p className="text-gray-400 text-sm">{message}</p>
  </div>
);

export default EmptyState;