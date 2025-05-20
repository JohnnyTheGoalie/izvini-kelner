import React from "react";
import { X } from "lucide-react";

interface WaiterCallOverlayProps {
  tableNumber: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const WaiterCallOverlay: React.FC<WaiterCallOverlayProps> = ({
  tableNumber,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex items-center justify-center px-4">
      <div className="relative bg-red-100 border-l-4 border-red-400 text-red-800 rounded-md shadow-lg p-6 w-full max-w-xs text-center">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-red-600 hover:text-red-800"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-base font-bold mb-1">
          🚨 Waiter called at Table #{tableNumber}
        </div>

        {/* Subtext */}
        <p className="text-sm text-black mb-5">
          Do you want to mark this call as handled?
        </p>

        {/* Action Button */}
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default WaiterCallOverlay;
