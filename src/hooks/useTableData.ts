// src/hooks/useTableData.ts
import { useEffect, useState } from "react";

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
type WaiterCalls = Record<number, string>;
type BillsByTable = Record<number, { total: number; tip: number; bill_type: string }>;

const useTableData = () => {
  const [orders, setOrders] = useState<OrdersByTable>({});
  const [waiterCalls, setWaiterCalls] = useState<WaiterCalls>({});
  const [bills, setBills] = useState<BillsByTable>({});

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://46.240.186.243:8000/kelner/order/get_active_orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Orders fetch failed");

      const data = await res.json();
      const parsed: OrdersByTable = {};

      for (const obj of data) {
        for (const key in obj) {
          const table = parseInt(key);
          const items: Item[] = obj[key];
          const byOrderId: Record<number, Item[]> = {};
          for (const item of items) {
            if (!byOrderId[item.order_id]) byOrderId[item.order_id] = [];
            byOrderId[item.order_id].push(item);
          }
          parsed[table] = byOrderId;
        }
      }

      setOrders(parsed);
    } catch (err) {
      console.error("fetchOrders:", err);
    }
  };


  const pollWaiterCalls = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://46.240.186.243:8000/kelner/notification/fetch_status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Calls fetch failed");

      const data = await res.json();
      const parsed: WaiterCalls = {};

      for (const obj of data) {
        for (const tableStr in obj) {
          const calls = obj[tableStr];
          for (const call of calls) {
            if (call.status === "Waiter") {
              parsed[parseInt(tableStr)] = call.timestamp;
              break;
            }
          }
        }
      }

      setWaiterCalls(parsed);
    } catch (err) {
      console.error("pollWaiterCalls:", err);
    }
  };

  const fetchBills = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://46.240.186.243:8000/kelner/bill/get_pending_bills", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Bills fetch failed");

      const data = await res.json();
      const parsed: BillsByTable = {};

      for (const obj of data) {
        for (const tableId in obj) {
          parsed[parseInt(tableId)] = obj[tableId];
        }
      }

      setBills(parsed);
    } catch (err) {
      console.error("fetchBills:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    pollWaiterCalls();
    fetchBills();

    const orderInterval = setInterval(fetchOrders, 10000);
    const callInterval = setInterval(pollWaiterCalls, 10000);
    const billInterval = setInterval(fetchBills, 10000);

    return () => {
      clearInterval(orderInterval);
      clearInterval(callInterval);
      clearInterval(billInterval);
    };
  }, []);

  const acceptOrder = async (tableId: number, orderId: number) => {
    const token = localStorage.getItem("authToken");
    const url = `http://46.240.186.243:8000/kelner/order/clear_table?table_id=${tableId}&order_id=${orderId}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(await res.text());
    await fetchOrders();
  };

  const acceptAllOrders = async (tableId: number) => {
    const token = localStorage.getItem("authToken");
    const url = `http://46.240.186.243:8000/kelner/order/clear_table?table_id=${tableId}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(await res.text());
    await fetchOrders();
  };

  const rejectOrder = async (orderId: number, tableId: number) => {
    const token = localStorage.getItem("authToken");
    const url = `http://46.240.186.243:8000/kelner/order/drop_order?order_id=${orderId}&table_id=${tableId}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(await res.text());
    await fetchOrders();
  };

  const confirmWaiterCall = async (tableId: number) => {
    const token = localStorage.getItem("authToken");
    const url = `http://46.240.186.243:8000/kelner/notification/clear_status?table_id=${tableId}&status=Waiter`;
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(await res.text());
    await pollWaiterCalls();
  };

  const confirmBill = async (tableId: number) => {
    const token = localStorage.getItem("authToken");
    const url = `http://46.240.186.243:8000/kelner/bill/clear_pending_bill/?table_id=${tableId}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(await res.text());
    await fetchBills();
  };

  return {
    orders,
    waiterCalls,
    bills,
    acceptOrder,
    rejectOrder,
    acceptAllOrders,
    confirmWaiterCall,
    confirmBill,
  };
};

export default useTableData;
