import React from "react";

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
  added: Addon[];
  omitted: Addon[];
}

interface OrderCardProps {
  tableNumber: number;
  items: Item[];
  timer?: string;
  onClick?: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ tableNumber, items, timer = "00:00", onClick}) => {
  return (
    <div className="bg-orange-100 border-l-4 border-orange-400 rounded-lg shadow p-3 w-full relative" onClick={onClick}>
      <div className="absolute top-2 right-3 text-[15px] text-amber-600">⏱ {timer}</div>

      <div className="w-full flex justify-center mb-3">
        <div className="w-14 h-14 rounded-full bg-white text-black text-xl font-bold flex items-center justify-center shadow">
          {tableNumber}
        </div>
      </div>

      <div className="mb-2">
        {items.map((item, index) => (
          <div key={index} className="text-sm text-gray-800 pl-4 mb-2">
            • {item.item_quantity} × {item.item_name}
            {item.added.length > 0 && (
              <span className="ml-1 text-green-600">
                {" (" + item.added.map(addon => `+${addon.addon_name}`).join(", ") + ")"}
              </span>
            )}
            {item.omitted.length > 0 && (
              <span className="ml-1 text-red-600">
                {" (" + item.omitted.map(addon => `-${addon.addon_name}`).join(", ") + ")"}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderCard;
