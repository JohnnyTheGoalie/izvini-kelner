import React from "react";

type TableState = "available" | "ordering" | "reserved" | "occupied";

type Table = {
  id: number;
  x: number;
  y: number;
  state: TableState;
};

type TableMapProps = {
  tables: Table[];
  onClick?: (table: Table) => void;
};

const stateColors: Record<TableState, string> = {
  available: "#16a34a",   // Green
  ordering: "#dc2626",    // Red
  reserved: "#facc15",    // Yellow
  occupied: "#2563eb",    // Blue
};

const TableMap: React.FC<TableMapProps> = ({ tables, onClick }) => {
  return (
    <div className="relative w-full h-[470px] bg-gray-100 border rounded-lg">
      {tables.map((table) => (
        <div
          key={table.id}
          onClick={() => onClick?.(table)}
          className="absolute cursor-pointer flex items-center justify-center text-white font-bold shadow-md"
          style={{
            left: table.x,
            top: table.y,
            width: 60,
            height: 60,
            backgroundColor: stateColors[table.state],
            borderRadius: "50%",
            userSelect: "none",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
          title={`Table ${table.id} (${table.state})`}
        >
          {table.id}
        </div>
      ))}
    </div>
  );
};

export default TableMap;
