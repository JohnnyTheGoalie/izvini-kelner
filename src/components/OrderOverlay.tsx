import React, { useRef } from "react";
import { X } from "lucide-react";
import OrderCard from "./OrderCard";

interface Props {
  tableNumber: number;
  orders: Record<number, Item[]>;
  onClose: () => void;
  onAcceptOrder: (orderId: number) => void;
  onRejectOrder: (orderId: number, tableId: number) => void;
  onAcceptAll: () => void;
}

const OrderOverlay: React.FC<Props> = ({
  tableNumber,
  orders,
  onClose,
  onAcceptOrder,
  onRejectOrder,
  onAcceptAll,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const sortedOrderIds = Object.keys(orders).map(Number).sort((a, b) => a - b);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex items-center justify-center px-4 py-8"
      onClick={handleBackdropClick}
    >
      <div
        ref={cardRef}
        className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl max-h-full overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
          aria-label="Close"
        >
          <X size={28} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          🧾 Narudžbine za sto #{tableNumber}
        </h2>

        {/* Orders List */}
        {sortedOrderIds.map((orderId) => (
          <div
            key={orderId}
            className="border border-gray-300 rounded-lg p-4 mb-6 shadow-sm"
          >
            <OrderCard tableNumber={tableNumber} items={orders[orderId]} />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-4">
              {/* Reject Button (Secondary/Smaller) */}
              <button
                className="text-red-500 hover:underline ml-3 text-sm"
                onClick={() => onRejectOrder(orderId, tableNumber)}
              >
                Odbij Narudžbinu
              </button>

              {/* Accept Button (Primary) */}
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold w-full sm:w-auto py-4 px-6 mr-3 rounded-xl text-lg"
                onClick={() => onAcceptOrder(orderId)}
              >
                Prihvati Narudžbinu
              </button>
            </div>
          </div>
        ))}

        {/* Accept All Button (only if more than 1 order) */}
        {sortedOrderIds.length > 1 && (
          <div className="mt-6 flex justify-center">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-4 rounded-xl text-xl"
              onClick={onAcceptAll}
            >
                Prihvati Sve Narudžbine
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderOverlay;
