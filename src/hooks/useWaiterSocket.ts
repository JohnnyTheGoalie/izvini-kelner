// src/hooks/useWaiterSocket.ts
import { useEffect } from "react";

interface UseWaiterSocketHandlers {
  onWaiterCall?: (tableId: number) => void;
  onBillRequested?: (tableId: number, total: number, tip: number, billType: string) => void;
  onNewOrder?: (payload: { order_id: number; table_id: number }) => void;
}

export const useWaiterSocket = ({ onWaiterCall, onBillRequested, onNewOrder }: UseWaiterSocketHandlers) => {
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const socket = new WebSocket(`ws://46.240.186.243:8000/kelner/ws?token=${token}`);

    socket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);

        switch (data.event) {
        case "waiter_notification":
            onWaiterCall?.(data.table_id);
            break;

        case "bill_requested":
            onBillRequested?.(data.table_id, data.total_amount, data.tip, data.bill_type);
            break;

        case "new_order":
            onNewOrder?.({ order_id: data.order_id, table_id: data.table_id });
            break;

        default:
            console.warn("Unhandled event type:", data.event);
            break;
        }
    } catch (err) {
        console.error("Failed to parse socket message", err);
    }
    };


    //return () => socket.close();
  }, []);
};
