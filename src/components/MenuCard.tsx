// MenuCard.tsx
import React, { useState } from "react";

interface MenuCardProps {
  name: string;
  initiallyAvailable: boolean;
  itemId: number;
  isAddon?: boolean;
}

const MenuCard: React.FC<MenuCardProps> = ({ name, initiallyAvailable, itemId, isAddon = false }) => {
  const [isAvailable, setIsAvailable] = useState(initiallyAvailable);

  const toggleAvailability = async () => {
    const newStatus = !isAvailable;
    const endpoint = isAddon
      ? `http://46.240.186.243:8000/kelner/admin/change_addon_status?addon_id=${itemId}&is_available=${newStatus}`
      : `http://46.240.186.243:8000/kelner/admin/change_menu_item_status?item_id=${itemId}&is_available=${newStatus}`;

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle availability");
      }

      setIsAvailable(newStatus);
    } catch (err) {
      console.error("Error toggling availability:", err);
    }
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
        {isAvailable ? "Označi kao nedostupno" : "Označi kao dostupno"}
      </button>
    </div>
  );
};

export default MenuCard;
