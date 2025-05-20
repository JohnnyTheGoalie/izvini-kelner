import React from "react";
import OrderItem from "./OrderItem";

interface OrderCardProps {
  tableNumber: number;
  items: { name: string; addons?: string[] }[];
  timer: string;
  totalPrice: string;
}

const OrderCard: React.FC<OrderCardProps> = ({ tableNumber, items, timer, totalPrice }) => {
  return (
    <div className="bg-orange-100 border-l-4 border-orange-400 rounded-lg shadow p-3 w-full relative">
      <div className="absolute top-2 right-3 text-[15px] text-amber-600">
        ⏱ {timer}
      </div>

      <div className="w-full flex justify-center mb-3">
        <div className="w-14 h-14 rounded-full bg-white text-black text-xl font-bold flex items-center justify-center shadow">
          {tableNumber}
        </div>
      </div>

      <div className="mb-2">
        {items.map((item, index) => (
          <OrderItem key={index} name={item.name} addons={item.addons} />
        ))}
      </div>

      <div className="text-right text-sm font-semibold text-gray-700">
        Total: {totalPrice}
      </div>
    </div>
  );
};

export default OrderCard;