import React from "react";
import OrderCard from "./OrderCard";

interface Props {
  tableNumber: number;
  orders: Record<number, Item[]>;
  onClose: () => void;
  onAcceptOrder: (orderId: number) => void;
  onRejectOrder: (orderId: number) => void;
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
  const sortedOrderIds = Object.keys(orders).map(Number).sort((a, b) => a - b);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-full overflow-y-auto relative">
        <button className="absolute top-2 right-4" onClick={onClose}>✖</button>
        <h2 className="text-xl font-bold mb-4 text-center">Orders for Table {tableNumber}</h2>

        {sortedOrderIds.map((orderId) => (
          <div key={orderId} className="border-b border-gray-300 mb-4 pb-2">
            <OrderCard tableNumber={tableNumber} items={orders[orderId]} />
            <div className="flex justify-end gap-2 mt-2">
              <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => onAcceptOrder(orderId)}>Accept</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => onRejectOrder(orderId)}>Reject</button>
            </div>
          </div>
        ))}

        <div className="mt-4 flex justify-center">
          <button className="bg-blue-600 text-white px-6 py-2 rounded" onClick={onAcceptAll}>Accept All Orders</button>
        </div>
      </div>
    </div>
  );
};

export default OrderOverlay;
