import React from "react";

interface WaiterCallProps {
  tableNumber: number;
  timeAgo: string; // e.g. "00:00", "02:15"
  onClick: () => void;
}

const WaiterCall: React.FC<WaiterCallProps> = ({ tableNumber, timeAgo, onClick }) => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div
        onClick={onClick}
        className="bg-red-100 border-l-4 border-red-400 text-red-800 px-4 py-3 rounded-md shadow-sm text-center max-w-xs w-full relative cursor-pointer hover:bg-red-200 transition"
      >
        <div className="absolute top-2 right-3 text-[15px] text-red-700 font-semibold">
          ⏱ {timeAgo}
        </div>
        <div className="w-full flex justify-center mb-3">
          <div className="w-14 h-14 rounded-full bg-white text-black text-xl font-bold flex items-center justify-center shadow">
            {tableNumber}
          </div>
        </div>
        <div className="text-base font-bold">
          🚨 Pozvan Konobar
        </div>
      </div>
    </div>
  );
};

export default WaiterCall;
