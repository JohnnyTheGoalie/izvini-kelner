// menucard.tsx
import React, { useState } from "react";

interface MenuCardProps {
  name: string;
  initiallyAvailable: boolean;
}

const MenuCard: React.FC<MenuCardProps> = ({ name, initiallyAvailable }) => {
  const [isAvailable, setIsAvailable] = useState(initiallyAvailable);

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
  };

  return (
    <div className="flex flex-col justify-between p-4 bg-white rounded-xl shadow-md border text-center w-full h-40">
      <div className="text-lg font-semibold text-gray-800 mb-4">{name}</div>
      <button
        onClick={toggleAvailability}
        className={`py-2 px-5 rounded-full font-medium text-white transition ${
          isAvailable
            ? "bg-green-600 hover:bg-green-700"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {isAvailable ? "Mark Unavailable" : "Mark Available"}
      </button>
    </div>
  );
};

export default MenuCard;
