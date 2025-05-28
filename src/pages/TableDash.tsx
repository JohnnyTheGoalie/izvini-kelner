import React, { useEffect, useState } from "react";
import { createObject, createTable, createZone, deleteObject, deleteTable, deleteZone, fetchObjects, fetchTables, fetchZones } from "../apiMap";
import TableInfoOverlay from "../components/TableInfoOverlay";
import { useNavigate } from "react-router-dom";

const TableDash: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const [zones, setZones] = useState<{ zone_id: number; zone_name: string }[]>([]);
  const [activeZone, setActiveZone] = useState<number | null>(null);
  const [tables, setTables] = useState<
    { table_id: number; table_number: number; zone_id: number; x: number; y: number }[]
  >([]);
  const [newTableNumber, setNewTableNumber] = useState<number>(0);
  const [editType, setEditType] = useState<string | null>(null);
  const [newZoneName, setNewZoneName] = useState<string>("");
  const [objects, setObjects] = useState<
    { object_id: number; zone_id: number; object_name: string; x1: number; y1: number; x2: number; y2: number }[]
  >([]);
  const [objectName, setObjectName] = useState<string>("");
  const [objectClickPoints, setObjectClickPoints] = useState<{ x: number; y: number }[]>([]);
  const [selectedTableNumber, setSelectedTableNumber] = useState<number | null>(null);

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





  //FETCH ZONES FROM API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [zoneData, tableData, objectData] = await Promise.all([
          fetchZones(),
          fetchTables(),
          fetchObjects()
        ]);

        setZones(zoneData);
        setTables(tableData);
        const highestTableNumber = Math.max(0, ...tableData.map(t => t.table_number));
        setNewTableNumber(highestTableNumber + 1);
        setObjects(objectData);

        if (zoneData.length > 0) setActiveZone(zoneData[0].zone_id);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  



  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex h-full space-x-3">
          {zones.map((zone) => (
            <button
              key={zone.zone_id}
              onClick={async () => {
                if (!editMode) {
                  setActiveZone(zone.zone_id);
                  return;
                }

                try {
                const tablesToDelete = tables.filter(t => t.zone_id === zone.zone_id);
                const objectsToDelete = objects.filter(o => o.zone_id === zone.zone_id);

                for (const table of tablesToDelete) {
                  await deleteTable(table.table_id);
                }

                // Add this after defining deleteObject in your API:
                for (const object of objectsToDelete) {
                  await deleteObject(object.object_id);
                }

                await deleteZone(zone.zone_id);

                const [updatedZones, updatedTables, updatedObjects] = await Promise.all([
                  fetchZones(),
                  fetchTables(),
                  fetchObjects()
                ]);

                setZones(updatedZones);
                setTables(updatedTables);
                setObjects(updatedObjects);


                  setZones(updatedZones);
                  setTables(updatedTables);

                  if (zone.zone_id === activeZone) {
                    setActiveZone(null);
                  }
                } catch (err) {
                  console.error("Failed to delete zone:", err);
                }
              }}
              className={`px-6 py-3 text-xl rounded-full  shadow ${
                activeZone === zone.zone_id
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-white text-[var(--color-primary)] border"
              }`}

            >
              {zone.zone_name}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Edit</label>
          <input
            type="checkbox"
            className="w-5 h-5"
            checked={editMode}
            onChange={(e) => setEditMode(e.target.checked)}
          />
        </div>
      </div>

      {editMode && (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="New zone name"
              className="border p-2 rounded"
              value={newZoneName}
              onChange={(e) => setNewZoneName(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded shadow"
              onClick={async () => {
                if (!newZoneName.trim()) return;

                try {
                  await createZone(newZoneName.trim());
                  const updatedZones = await fetchZones();
                  setZones(updatedZones);
                  setNewZoneName("");
                } catch (err) {
                  console.error("Failed to create zone:", err);
                }
              }}
            >
              Add Zone
            </button>
          </div>


          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                name="editType"
                checked={editType === "table"}
                onChange={() => setEditType("table")}
              />
              <span className="ml-1">Dodaj Sto</span>
            </label>
            <label>
              <input
                type="radio"
                name="editType"
                checked={editType === "object"}
                onChange={() => setEditType("object")}
              />
              <span className="ml-1">Dodaj Objekat</span>
            </label>
          </div>

          <div className="flex space-x-2 items-center">
            <label>Broj Stola:</label>
            <input
              type="number"
              className="border p-2 rounded w-24"
              placeholder={`${newTableNumber}`}
              value={isNaN(newTableNumber) ? "" : newTableNumber}
              onChange={(e) => {
                const value = e.target.value;
                setNewTableNumber(value === "" ? NaN : Number(value));
              }}
            />

          </div>

          <div className="flex space-x-2 items-center">
            <label>Ime Objekta:</label>
            <input
              type="text"
              className="border p-2 rounded"
              value={objectName}
              onChange={(e) => setObjectName(e.target.value)}
              placeholder="Object Name"
            />
          </div>
        </div>
      )}

      <div
        className="relative w-full h-[60vh] bg-gray-100 border rounded"
        onClick={async (e) => {
        if (!editMode || activeZone === null) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const gridSize = 70;
        const rawX = e.clientX - rect.left;
        const rawY = e.clientY - rect.top;

        const x = Math.round(rawX / gridSize) * gridSize;
        const y = Math.round(rawY / gridSize) * gridSize;


        if (editType === "table") {
          try {
            const tableNumberToUse = isNaN(newTableNumber)
              ? Math.max(0, ...tables.map(t => t.table_number)) + 1
              : newTableNumber;

            await createTable(activeZone, tableNumberToUse, x, y);
            const updatedTables = await fetchTables();
            setTables(updatedTables);

            // Optionally update to next available number for convenience
            const nextTableNumber = Math.max(0, ...updatedTables.map(t => t.table_number)) + 1;
            setNewTableNumber(nextTableNumber);
          } catch (err) {
            console.error("Failed to create table:", err);
          }
        }


        if (editType === "object") {
          /*if (!objectName.trim()) {
            console.warn("Object name is required.");
            return;
          }*/

          const newPoint = { x, y };
          const updatedPoints = [...objectClickPoints, newPoint];

          if (updatedPoints.length === 2) {
            const sanitize = (val: number) => Math.round(val / gridSize) * gridSize;

            const [{ x: x1Raw, y: y1Raw }, { x: x2Raw, y: y2Raw }] = updatedPoints;
            const x1 = sanitize(x1Raw);
            const y1 = sanitize(y1Raw);
            const x2 = sanitize(x2Raw);
            const y2 = sanitize(y2Raw);


            try {
              await createObject(activeZone, objectName.trim(), x1, y1, x2, y2);
              const updatedObjects = await fetchObjects();
              setObjects(updatedObjects);
              setObjectClickPoints([]); // reset points
              setObjectName(""); // optional: reset name
            } catch (err) {
              console.error("Failed to create object:", err);
            }
          } else {
            setObjectClickPoints(updatedPoints);
          }
        }
      }}

      >

        {objects
          .filter((obj) => obj.zone_id === activeZone)
          .map((obj) => {
            const x = Math.min(obj.x1, obj.x2);
            const y = Math.min(obj.y1, obj.y2);
            const width = Math.abs(obj.x2 - obj.x1);
            const height = Math.abs(obj.y2 - obj.y1);

            return (
              <div
                key={obj.object_id}
                className="absolute bg-yellow-400 text-xs text-black px-1 py-0.5 rounded shadow border"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  width: `${width}px`,
                  height: `${height}px`,
                  transform: "translate(0, 0)",
                }}
                onClick={async (e) => {
                  e.stopPropagation(); // prevent canvas click
                  if (!editMode) return;

                  try {
                    await deleteObject(obj.object_id);
                    const updatedObjects = await fetchObjects();
                    setObjects(updatedObjects);
                  } catch (err) {
                    console.error("Failed to delete object:", err);
                  }
                }}
              >
                {obj.object_name}
              </div>
            );
          })}



        {tables
          .filter((table) => table.zone_id === activeZone)
          .map((table) => (
            <div
              key={table.table_id}
              className="absolute bg-green-500 text-white rounded-full flex items-center justify-center shadow cursor-pointer"
              style={{
                width: "60px",
                height: "60px",
                left: `${table.x}px`,
                top: `${table.y}px`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={async (e) => {
                e.stopPropagation();
                if (!editMode) {
                  setSelectedTableNumber(table.table_number);
                  return;
                }
                try {
                  await deleteTable(table.table_id);
                  const updatedTables = await fetchTables();
                  setTables(updatedTables);
                } catch (err) {
                  console.error("Failed to delete table:", err);
                }
              }}

            >
              {table.table_number}
            </div>
        ))}

      </div>

      <div className="flex justify-center gap-6">
        {/* State legend placeholder */}
      </div>


      {selectedTableNumber !== null && (
        <TableInfoOverlay
          tableNumber={selectedTableNumber}
          onClose={() => setSelectedTableNumber(null)}
        />
      )}

    </div>
  );
};

export default TableDash;
