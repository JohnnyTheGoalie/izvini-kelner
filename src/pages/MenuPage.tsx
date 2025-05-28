// MenuPage.tsx
import React, { useEffect, useState } from "react";
import MenuCard from "../components/MenuCard";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  item_id: number;
  item_name: string;
  item_name_en: string;
  item_category: string;
  item_subcategory: string;
  item_rank: number;
  item_price: number;
  options: boolean;
  available: boolean;
}

interface Addon {
  addon_id: number;
  name: string;
  name_en: string;
  price: number;
  is_default: boolean;
  available: boolean;
}

const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);

  //INACTIVE
  const navigate = useNavigate();

  useEffect(() => {
    let timeout = setTimeout(() => navigate("/home"), 10000);

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => navigate("/home"), 10000);
    };

    window.addEventListener("touchstart", resetTimer);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("touchstart", resetTimer);
    };
  }, [navigate]);


  useEffect(() => {
  const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const [menuRes, addonsRes] = await Promise.all([
          fetch("http://46.240.186.243:8000/kelner/admin/menu", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://46.240.186.243:8000/kelner/admin/menu/addons", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!menuRes.ok || !addonsRes.ok) {
          throw new Error("Failed to fetch menu or addons");
        }

        const menuData = await menuRes.json();
        const addonsData = await addonsRes.json();

        // Sort alphabetically by name
        menuData.sort((a: MenuItem, b: MenuItem) =>
          a.item_name.localeCompare(b.item_name)
        );
        addonsData.sort((a: Addon, b: Addon) =>
          a.name.localeCompare(b.name)
        );

        setMenuItems(menuData);
        setAddons(addonsData);
      } catch (err) {
        console.error("Error fetching menu/addons:", err);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="p-6 pt-14 max-w-7xl mx-auto">
      <h2 className="text-2xl text-center mb-8 text-[--color-text-primary]">Meni</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {menuItems.map((item) => (
          <MenuCard
            key={item.item_id}
            name={item.item_name}
            initiallyAvailable={item.available}
            itemId={item.item_id}
          />
        ))}
      </div>
      <h2 className="text-2xl text-center mb-6 text-[--color-text-primary]">Dodaci</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {addons.map((addon) => (
          <MenuCard
            key={addon.addon_id}
            name={addon.name}
            initiallyAvailable={addon.available}
            itemId={addon.addon_id}
            isAddon={true}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
