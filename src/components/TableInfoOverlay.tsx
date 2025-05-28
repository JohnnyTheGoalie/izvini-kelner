// components/TableInfoOverlay.tsx
import React, { useRef } from "react";
import { X } from "lucide-react";
import useTableData from "../hooks/useTableData";
import OrderCard from "./OrderCard";

interface TableInfoOverlayProps {
  tableNumber: number;
  onClose: () => void;
}

const TableInfoOverlay: React.FC<TableInfoOverlayProps> = ({ tableNumber, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const {
    orders,
    waiterCalls,
    bills,
    acceptOrder,
    rejectOrder,
    acceptAllOrders,
    confirmWaiterCall,
    confirmBill,
  } = useTableData();

  const orderGroups = orders[tableNumber] || {};
  const bill = bills[tableNumber];
  const callTime = waiterCalls[tableNumber];

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const diffMs = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diffMs / 60000).toString().padStart(2, "0");
    const secs = Math.floor((diffMs % 60000) / 1000).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex items-center justify-center px-4 py-8"
      onClick={handleBackdropClick}
    >
      <div
        ref={cardRef}
        className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          <X size={28} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          Sto #{tableNumber}
        </h2>

        {/* Orders Section */}
        {Object.keys(orderGroups).length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">🧾 Narudžbine</h3>
            {Object.entries(orderGroups).map(([orderIdStr, items]) => {
              const orderId = parseInt(orderIdStr);
              return (
                <div key={orderId} className="mb-6 border rounded-lg p-4 shadow-sm">
                  <OrderCard tableNumber={tableNumber} items={items}/>
                  <div className="flex flex-col sm:flex-row sm:justify-between mt-3 gap-3">
                    <button
                      onClick={() => rejectOrder(orderId, tableNumber)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Odbij Narudžbinu
                    </button>
                    <button
                      onClick={() => acceptOrder(tableNumber, orderId)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold"
                    >
                        Prihvati Narudžbinu
                    </button>
                  </div>
                </div>
              );
            })}
            {Object.keys(orderGroups).length > 1 && (
              <div className="text-center mt-4">
                <button
                  onClick={() => acceptAllOrders(tableNumber)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold"
                >
                    Prihvati Sve Narudžbine
                </button>
              </div>
            )}
          </div>
        )}

        {/* Waiter Call Section */}
        {callTime && (
          <div className="mb-8 bg-red-100 rounded-xl p-3">
            <h3 className="text-xl font-bold mb-4">🚨 Waiter Call</h3>
            <div className="text-center text-red-600 font-semibold text-lg mb-3">
                Vreme Čekanja: {formatTimeAgo(callTime)}
            </div>
            <div className="text-center">
              <button
                onClick={() => confirmWaiterCall(tableNumber)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold"
              >
                Potvrdi Poziv za Konobara
              </button>
            </div>
          </div>
        )}

        {/* Bill Section */}
        {bill && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">💵 Bill</h3>
            <div className="text-lg mb-1">Račun: {bill.total.toFixed(2)}</div>
            <div className="text-lg mb-1">Bakšiš: {bill.tip.toFixed(2)}</div>
            <div className="text-xl font-bold mb-2">
              Ukupno: {(bill.total + bill.tip).toFixed(2)}
            </div>
            <div className="uppercase font-semibold text-green-700 mb-4">
              Metod: {bill.bill_type}
            </div>
            <div className="text-center">
              <button
                onClick={() => confirmBill(tableNumber)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold"
              >
                Potvrdi Plaćanje
              </button>
            </div>
          </div>
        )}

        {/* Nothing to show */}
        {!callTime && !bill && Object.keys(orderGroups).length === 0 && (
          <div className="text-center text-gray-500 font-medium">
            Nema aktivnih narudžbina, poziva konobara ili računa za ovaj sto.
          </div>
        )}
      </div>
    </div>
  );
};

export default TableInfoOverlay;
