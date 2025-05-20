import React, { useState } from "react";
import TableMap from "../components/TableMap";

export type TableState = "available" | "ordering" | "reserved" | "occupied";

export type Table = {
  id: number;
  x: number;
  y: number;
  state: TableState;
};

const initialTables: Table[] = [
  { id: 1, x: 60, y: 100, state: "available" },
  { id: 2, x: 200, y: 120, state: "ordering" },
  { id: 3, x: 340, y: 220, state: "reserved" },
  { id: 4, x: 480, y: 320, state: "occupied" },
];

const stateColors: Record<TableState, string> = {
  available: "bg-green-500",
  ordering: "bg-red-500",
  reserved: "bg-yellow-500",
  occupied: "bg-blue-500",
};

const TableDash: React.FC = () => {
  const [tables, setTables] = useState<Table[]>(initialTables);

  const handleTableClick = (table: Table) => {
    setTables((prevTables) =>
      prevTables.map((t) =>
        t.id === table.id
          ? {
              ...t,
              state: getNextState(t.state),
            }
          : t
      )
    );
  };

  const getNextState = (state: TableState): TableState => {
    const order: TableState[] = ["available", "ordering", "reserved", "occupied"];
    return order[(order.indexOf(state) + 1) % order.length];
  };

  return (
    <div className=" pt-14 bg-[var(--color-background)] min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className=" bg-[var(--color-background)] shadow-xl rounded-xl p-4">
          <TableMap
            tables={tables}
            onClick={handleTableClick}
          />
          <div className="mt-4 flex justify-center space-x-4">
            {Object.entries(stateColors).map(([state, color]) => (
              <div key={state} className="flex items-center">
                <div className={`w-4 h-4 ${color} rounded-full mr-2`} />
                <span className="text-sm capitalize text-gray-600">{state}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableDash;