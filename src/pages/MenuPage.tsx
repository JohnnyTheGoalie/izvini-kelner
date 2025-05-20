// menupage.tsx
import React from "react";
import MenuCard from "../components/MenuCard";

const menuItems = [
  { name: "Margherita Pizza", available: true },
  { name: "Caesar Salad", available: false },
  { name: "Spaghetti Carbonara", available: true },
  { name: "Grilled Chicken Sandwich", available: false },
  { name: "Greek Salad", available: true },
  { name: "Tomato Soup", available: true },
];

const MenuPage: React.FC = () => {
  return (
    <div className="p-6 pt-14 max-w-7xl mx-auto">
      <h2 className="text-2xl text-center mb-8 text-[--color-text-primary]">
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {menuItems.map((item, index) => (
          <MenuCard
            key={index}
            name={item.name}
            initiallyAvailable={item.available}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
