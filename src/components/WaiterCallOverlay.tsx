import React, { useRef } from "react";
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
  const cardRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex items-center justify-center px-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={cardRef}
        className="relative bg-red-100 border-l-4 border-red-400 text-red-800 rounded-xl shadow-2xl p-8 w-full max-w-md text-center"
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-red-600 hover:text-red-800"
          aria-label="Close"
        >
          <X size={28} />
        </button>

        {/* Header */}
        <div className="text-2xl font-bold mb-4">
          🚨 Konobar pozvan za sto #{tableNumber}
        </div>

        {/* Subtext */}
        <p className="text-lg text-black mb-6">
          Molimo potvrdite da ste primili poziv konobara za ovaj sto.
        </p>

        {/* Action Button */}
        <button
          onClick={onConfirm}
          className="w-full py-5 rounded-xl text-xl font-bold bg-red-500 text-white hover:bg-red-600 transition"
        >
          Potvrdi
        </button>
      </div>
    </div>
  );
};

export default WaiterCallOverlay;
