import React, { useState, useEffect } from "react";
import OrderCard from "../components/OrderCard";
import WaiterCall from "../components/WaiterCall";
import WaiterCallOverlay from "../components/WaiterCallOverlay";
import OrderOverlay from "../components/OrderOverlay";
import BillCard from "../components/BillCard";
import BillOverlay from "../components/BillOverlay";

interface Addon {
  addon_id: number;
  addon_name: string;
  addon_price: number;
}

interface Item {
  item_id: number;
  item_quantity: number;
  item_price: number;
  item_name: string;
  item_category: string;
  item_subcategory: string;
  item_rank: number;
  order_id: number;
  added: Addon[];
  omitted: Addon[];
}

type OrdersByTable = Record<number, Record<number, Item[]>>;
type WaiterCalls = Record<number, string>; // tableNumber -> timestamp

const WaiterHome: React.FC = () => {
  const [orders, setOrders] = useState<OrdersByTable>({});
  const [overlayOrdersTable, setOverlayOrdersTable] = useState<number | null>(null);
  const [waiterCalls, setWaiterCalls] = useState<WaiterCalls>({});
  const [overlayTable, setOverlayTable] = useState<number | null>(null);
  const [pendingBills, setPendingBills] = useState<Record<number, { total: number; tip: number; bill_type: string }>>({});
  const [overlayBillTable, setOverlayBillTable] = useState<number | null>(null);


  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://46.240.186.243:8000/kelner/order/get_active_orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();
      const tableOrders: OrdersByTable = {};

      for (const obj of data) {
        for (const key in obj) {
          const tableNumber = parseInt(key);
          const items: Item[] = obj[key];
          const ordersById: Record<number, Item[]> = {};
          for (const item of items) {
            if (!ordersById[item.order_id]) {
              ordersById[item.order_id] = [];
            }
            ordersById[item.order_id].push(item);
          }
          tableOrders[tableNumber] = ordersById;
        }
      }

      setOrders(tableOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const pollWaiterCalls = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://46.240.186.243:8000/kelner/notification/fetch_status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch waiter calls");

      const data = await response.json();
      const activeCalls: WaiterCalls = {};

      for (const obj of data) {
        for (const tableStr in obj) {
          const callList = obj[tableStr];
          if (Array.isArray(callList)) {
            for (const call of callList) {
              if (call.status === "Waiter") {
                activeCalls[parseInt(tableStr)] = call.timestamp;
                break; // Only need the first waiter call per table
              }
            }
          }
        }
    }


      setWaiterCalls(activeCalls);
    } catch (err) {
      console.error("Error polling waiter calls:", err);
    }
  };

  const fetchBills = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://46.240.186.243:8000/kelner/bill/get_pending_bills", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch bills");

      const data = await response.json();
      const billMap: Record<number, { total: number; tip: number; bill_type: string }> = {};
      for (const obj of data) {
        for (const tableId in obj) {
          billMap[parseInt(tableId)] = obj[tableId];
        }
      }
      setPendingBills(billMap);
    } catch (err) {
      console.error("Error fetching bills:", err);
    }
  };


  useEffect(() => {
    fetchOrders();
    pollWaiterCalls();
    fetchBills();
    const orderInterval = setInterval(fetchOrders, 2000);
    const callInterval = setInterval(pollWaiterCalls, 2000);
    const billInterval = setInterval(fetchBills, 2000);


    return () => {
      clearInterval(orderInterval);
      clearInterval(callInterval);
      clearInterval(billInterval);
    };
  }, []);

  const handleAcceptOrder = async (orderId: number) => {
    try {
      const token = localStorage.getItem("authToken");
      const url = `http://46.240.186.243:8000/kelner/order/clear_table?table_id=${overlayOrdersTable}&order_id=${orderId}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Unknown error");

      setOverlayOrdersTable(null);
      await fetchOrders();
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  const handleAcceptAllOrders = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const url = `http://46.240.186.243:8000/kelner/order/clear_table?table_id=${overlayOrdersTable}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Unknown error");

      setOverlayOrdersTable(null);
      await fetchOrders();
    } catch (error) {
      console.error("Error accepting all orders:", error);
    }
  };

  const handleRejectOrder = async (orderId: number) => {
    try {
      const token = localStorage.getItem("authToken");
      const url = `http://46.240.186.243:8000/kelner/order/drop_order?order_id=${orderId}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Unknown error");

      setOverlayOrdersTable(null);
      await fetchOrders();
    } catch (error) {
      console.error("Error rejecting order:", error);
    }
  };


  const handleConfirmWaiterCall = async (tableId: number) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://46.240.186.243:8000/kelner/notification/clear_status?table_id=${tableId}&status=Waiter`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Unknown error");

      const updatedCalls = { ...waiterCalls };
      delete updatedCalls[tableId];
      setWaiterCalls(updatedCalls);
      setOverlayTable(null);
      await pollWaiterCalls();
    } catch (error) {
      console.error("Failed to clear waiter call:", error);
    }
  };

  const handleConfirmBill = async (tableId: number) => {
    try {
      const token = localStorage.getItem("authToken");
      const url = `http://46.240.186.243:8000/kelner/bill/clear_pending_bill/?table_id=${tableId}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Unknown error");

      // Remove the bill from the state
      const updatedBills = { ...pendingBills };
      delete updatedBills[tableId];
      setPendingBills(updatedBills);
    } catch (error) {
      console.error("Failed to confirm bill:", error);
    }
  };


  const formatTimeAgo = (timestamp: string) => {
    const diffMs = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diffMs / 60000).toString().padStart(2, "0");
    const secs = Math.floor((diffMs % 60000) / 1000).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  

  return (
    <div className="bg-[var(--color-background)] flex flex-col items-center py-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-6xl px-4">

        {Object.entries(orders).map(([tableNumber, ordersById]) => (
          <OrderCard
            key={`order-${tableNumber}`}
            tableNumber={parseInt(tableNumber)}
            items={Object.values(ordersById).flat()}
            timer="00:00"
            onClick={() => setOverlayOrdersTable(parseInt(tableNumber))}
          />
        ))}

        {Object.entries(waiterCalls).map(([tableNumberStr, timestamp]) => {
          const tableNumber = parseInt(tableNumberStr);
          return (
            <WaiterCall
              key={`waiter-${tableNumber}`}
              tableNumber={tableNumber}
              timeAgo={formatTimeAgo(timestamp)}
              onClick={() => setOverlayTable(tableNumber)}
            />
          );
        })}

        {Object.entries(pendingBills).map(([tableNumberStr, bill]) => {
          const tableNumber = parseInt(tableNumberStr);
          return (
            <BillCard
              key={`bill-${tableNumber}`}
              tableNumber={tableNumber}
              total={bill.total}
              tip={bill.tip}
              method={bill.bill_type}
              onClick={() => setOverlayBillTable(tableNumber)}
            />
          );
        })}
      </div>
      {overlayBillTable !== null && pendingBills[overlayBillTable] && (
        <BillOverlay
          tableNumber={overlayBillTable}
          total={pendingBills[overlayBillTable].total}
          tip={pendingBills[overlayBillTable].tip}
          method={pendingBills[overlayBillTable].bill_type}
          onClose={() => setOverlayBillTable(null)}
          onConfirm={() => {
            setOverlayBillTable(null);
            handleConfirmBill(overlayBillTable);
          }}
        />
      )}
      {overlayTable !== null && (
        <WaiterCallOverlay
          tableNumber={overlayTable}
          onConfirm={() => {
            handleConfirmWaiterCall(overlayTable);
            setOverlayTable(null);
          }}
          onCancel={() => setOverlayTable(null)}
        />
      )}

      {overlayOrdersTable !== null && orders[overlayOrdersTable] && (
        <OrderOverlay
          tableNumber={overlayOrdersTable}
          orders={orders[overlayOrdersTable]}
          onClose={() => setOverlayOrdersTable(null)}
          onAcceptOrder={handleAcceptOrder}
          onRejectOrder={handleRejectOrder}
          onAcceptAll={handleAcceptAllOrders}
        />
      )}

    </div>
  );
};

export default WaiterHome;