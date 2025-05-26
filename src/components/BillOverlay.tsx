import React from "react";
import { X } from "lucide-react";

interface BillOverlayProps {
  tableNumber: number;
  total: number;
  tip: number;
  method: string;
  onClose: () => void;
  onConfirm?: () => void;
}

const BillOverlay: React.FC<BillOverlayProps> = ({ tableNumber, total, tip, method, onClose, onConfirm }) => {
  const finalAmount = total + tip;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex items-center justify-center px-4">
      <div className="relative bg-green-100 border-l-4 border-green-400 text-green-800 rounded-md shadow-lg p-6 w-full max-w-xs text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-green-600 hover:text-green-800"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-base font-bold mb-2">
          💵 Bill for Table #{tableNumber}
        </div>

        {/* Bill Details */}
        <div className="text-sm mb-1">Total: ${total.toFixed(2)}</div>
        <div className="text-sm mb-1">Tip: ${tip.toFixed(2)}</div>
        <div className="text-lg font-semibold mb-2">Total Due: ${finalAmount.toFixed(2)}</div>
        <div className="text-xs uppercase text-gray-600 mb-4">{method}</div>

        {/* Confirmation Button */}
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-md text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition"
        >
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default BillOverlay;
