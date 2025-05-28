import React, { useRef } from "react";
import { X } from "lucide-react";

interface BillOverlayProps {
  tableNumber: number;
  total: number;
  tip: number;
  method: string;
  onClose: () => void;
  onConfirm?: () => void;
}

const BillOverlay: React.FC<BillOverlayProps> = ({
  tableNumber,
  total,
  tip,
  method,
  onClose,
  onConfirm,
}) => {
  const finalAmount = total + tip;
  const cardRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex items-center justify-center px-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={cardRef}
        className="relative bg-green-100 border-l-4 border-green-400 text-green-800 rounded-xl shadow-2xl p-8 w-full max-w-md text-center"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-green-600 hover:text-green-800"
          aria-label="Close"
        >
          <X size={28} />
        </button>

        {/* Header */}
        <div className="text-2xl font-bold mb-4">
          💵 Račun za sto #{tableNumber}
        </div>

        {/* Bill Details */}
        <div className="text-lg mb-2">Račun: {total.toFixed(2)}</div>
        <div className="text-lg mb-2">Bakšiš: {tip.toFixed(2)}</div>
        <div className="text-xl font-bold mb-3">
          Ukupno: ${finalAmount.toFixed(2)}
        </div>
        <div className="bg-white text-green-700 text-2xl uppercase font-semibold rounded-xl px-4 py-2 mb-6 inline-block shadow">
          {method}
        </div>


        {/* Confirmation Button */}
        <button
          onClick={onConfirm}
          className="w-full py-5 rounded-xl text-xl font-bold bg-green-500 text-white hover:bg-green-600 transition"
        >
          Potvrdi plaćanje
        </button>
      </div>
    </div>
  );
};

export default BillOverlay;
