import React from "react";

interface OrderItemProps {
  name: string;
  addons?: string[]; // e.g. ['-ice', '+fries']
}

const OrderItem: React.FC<OrderItemProps> = ({ name, addons = [] }) => {
  return (
    <div className="text-sm text-gray-800 pl-4 mb-1">
      • {name}
      {addons.length > 0 && (
        <span className="ml-1 text-gray-500">
          ({addons.join(", ")})
        </span>
      )}
    </div>
  );
};

export default OrderItem;
