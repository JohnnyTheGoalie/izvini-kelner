import React, { useState } from "react";
import OrderCard from "../components/OrderCard";
import WaiterCall from "../components/WaiterCall";
import BillRequest from "../components/BillRequest";
import WaiterCallOverlay from "../components/WaiterCallOverlay";
import CustomerOnlineCard from "../components/CustomerOnlineCard";

const WaiterHome: React.FC = () => {
  const [overlayTable, setOverlayTable] = useState<number | null>(null);

  const handleOpenOverlay = (tableNumber: number) => {
    setOverlayTable(tableNumber);
  };

  const handleConfirm = () => {
    // Add your logic for handling confirmation (e.g., remove the waiter call)
    setOverlayTable(null);
  };

  const handleCancel = () => {
    setOverlayTable(null);
  };

  return (
    <div className="bg-[var(--color-background)] flex flex-col items-center py-14">
      <div className="w-full max-w-5xl">
      </div>

      <div className="w-full max-w-5xl px-4 py-2 text-center text-gray-500">
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full max-w-11/12 px-2 py-2">
        {/* Make WaiterCall clickable */}
        <div onClick={() => handleOpenOverlay(5)} className="cursor-pointer">
          <WaiterCall tableNumber={5} timeAgo="01:23" />
        </div>

        {/* Other components */}
        <OrderCard
          tableNumber={3}
          items={[
            { name: "Coke", addons: ["-ice"] },
            { name: "Pepsi" },
            { name: "Chicken Sandwich", addons: ["+fries"] },
          ]}
          timer="00:00"
          totalPrice="$18.50"
        />

        <BillRequest
          tableNumber={4}
          total={32.5}
          tip={5}
          method="card"
          timeAgo="03:21"
        />

        <CustomerOnlineCard tableNumber={8} timeAgo="00:15" />
        <CustomerOnlineCard tableNumber={8} timeAgo="00:15" />
        <CustomerOnlineCard tableNumber={8} timeAgo="00:15" />
        <CustomerOnlineCard tableNumber={8} timeAgo="00:15" />
        <CustomerOnlineCard tableNumber={8} timeAgo="00:15" />
        <CustomerOnlineCard tableNumber={8} timeAgo="00:15" />
        <CustomerOnlineCard tableNumber={8} timeAgo="00:15" />
        

        {/* Additional OrderCards... */}
      </div>

      {/* Conditionally show the overlay */}
      {overlayTable !== null && (
        <WaiterCallOverlay
          tableNumber={overlayTable}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default WaiterHome;
