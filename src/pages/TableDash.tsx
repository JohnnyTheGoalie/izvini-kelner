import React, { useState } from "react";

export type TableState = "available" | "ordering" | "reserved" | "occupied";
export type Zone = "indoor" | "garden" | "balcony";

export type Table = {
  id: number;
  x: number;
  y: number;
  z: Zone;
  state: TableState;
};

const stateColors: Record<TableState, string> = {
  available: "bg-green-500",
  ordering: "bg-red-500",
  reserved: "bg-yellow-500",
  occupied: "bg-blue-500",
};

const initialTables: Table[] = [
  { id: 1, x: 50, y: 60, z: "indoor", state: "available" },
  { id: 2, x: 150, y: 90, z: "garden", state: "reserved" },
  { id: 3, x: 250, y: 120, z: "balcony", state: "occupied" },
];

const zones: Zone[] = ["indoor", "garden", "balcony"];

const TableManager: React.FC = () => {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [selectedZone, setSelectedZone] = useState<Zone>("indoor");
  const [editMode, setEditMode] = useState(false);
  const [customId, setCustomId] = useState<number | null>(null);
  const [editModeType, setEditModeType] = useState<"table" | "object">("table");
  const [objectName, setObjectName] = useState("");
  const [objectPoints, setObjectPoints] = useState<{ x: number; y: number }[]>([]);
  const [objects, setObjects] = useState<
    { name: string; x1: number; y1: number; x2: number; y2: number; z: Zone }[]
  >([]);

  const getNextId = () => {
    return Math.max(0, ...tables.map((t) => t.id)) + 1;
  };

  const handleAddPoint = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!editMode) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    if (editModeType === "table") {
      const newTable: Table = {
        id: customId ?? getNextId(),
        x: point.x - 30,
        y: point.y - 30,
        z: selectedZone,
        state: "available",
      };
      setTables((prev) => [...prev, newTable]);
      setCustomId(null);
    } else if (editModeType === "object") {
      const newPoints = [...objectPoints, point];
      if (newPoints.length === 2) {
        setObjects((prev) => [
          ...prev,
          {
            name: objectName || "Unnamed",
            x1: newPoints[0].x,
            y1: newPoints[0].y,
            x2: newPoints[1].x,
            y2: newPoints[1].y,
            z: selectedZone,
          },
        ]);
        setObjectPoints([]);
        setObjectName("");
      } else {
        setObjectPoints(newPoints);
      }
    }
  };

  const handleCycleState = (id: number) => {
    if (editMode) return;
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, state: getNextState(t.state) } : t))
    );
  };

  const getNextState = (state: TableState): TableState => {
    const order: TableState[] = ["available", "ordering", "reserved", "occupied"];
    return order[(order.indexOf(state) + 1) % order.length];
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-3">
          {zones.map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`w-40 h-20 rounded-full text-lg font-semibold shadow ${
                selectedZone === zone
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-primary)] bg-[var(--color-background)] border border-[var(--color-primary)] opacity-70"
              } hover:opacity-100 transition`}
            >
              {zone}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Edit Mode</label>
          <input
            type="checkbox"
            checked={editMode}
            onChange={(e) => setEditMode(e.target.checked)}
            className="w-5 h-5"
          />
        </div>
      </div>

      {editMode && (
        <div className="flex flex-col space-y-2 mt-4">
          <div className="flex space-x-4 items-center">
            <label className="text-sm font-medium">Action:</label>
            <label>
              <input
                type="radio"
                name="editModeType"
                value="table"
                checked={editModeType === "table"}
                onChange={() => setEditModeType("table")}
              />
              <span className="ml-1">Add Table</span>
            </label>
            <label>
              <input
                type="radio"
                name="editModeType"
                value="object"
                checked={editModeType === "object"}
                onChange={() => setEditModeType("object")}
              />
              <span className="ml-1">Add Object</span>
            </label>
          </div>

          {editModeType === "table" && (
            <div className="flex items-center space-x-2">
              <label className="text-sm">New Table ID:</label>
              <input
                type="number"
                value={customId ?? getNextId()}
                onChange={(e) => setCustomId(parseInt(e.target.value, 10))}
                className="border p-2 rounded w-28"
              />
            </div>
          )}

          {editModeType === "object" && (
            <div className="flex items-center space-x-2">
              <label className="text-sm">Object Name:</label>
              <input
                type="text"
                value={objectName}
                onChange={(e) => setObjectName(e.target.value)}
                className="border p-2 rounded w-40"
              />
            </div>
          )}
        </div>
      )}

      <div
        className="relative w-full h-[500px] bg-[var(--color-background)] border rounded"
        onClick={handleAddPoint}
      >
        {tables
          .filter((t) => t.z === selectedZone)
          .map((table) => (
            <div
              key={table.id}
              onClick={(e) => {
                e.stopPropagation();
                handleCycleState(table.id);
              }}
              className={`absolute w-[60px] h-[60px] rounded-full text-white font-bold flex items-center justify-center cursor-pointer shadow-md ${stateColors[table.state]}`}
              style={{ left: table.x, top: table.y }}
              title={`Table ${table.id} (${table.state})`}
            >
              {table.id}
            </div>
          ))}

        {objects
          .filter((obj) => obj.z === selectedZone)
          .map((obj, index) => {
            const left = Math.min(obj.x1, obj.x2);
            const top = Math.min(obj.y1, obj.y2);
            const width = Math.abs(obj.x2 - obj.x1);
            const height = Math.abs(obj.y2 - obj.y1);
            return (
              <div
                key={index}
                className="absolute bg-gray-400 bg-opacity-60 border border-gray-700 text-xs flex items-center justify-center shadow-sm"
                style={{ left, top, width, height }}
                title={obj.name}
              >
                {obj.name}
              </div>
            );
          })}
      </div>

      <div className="flex justify-center gap-6">
        {Object.entries(stateColors).map(([state, color]) => (
          <div key={state} className="flex items-center space-x-2">
            <div className={`w-4 h-4 ${color} rounded-full`} />
            <span className="capitalize text-sm text-gray-600">{state}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableManager;