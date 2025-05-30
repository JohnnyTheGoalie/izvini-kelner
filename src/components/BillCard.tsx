import React from "react";

interface BillCardProps {
  tableNumber: number;
  total: number;
  tip: number;
  method: string;
  onClick: () => void;
}

const BillCard: React.FC<BillCardProps> = ({ tableNumber, total, tip, method, onClick }) => {
  const finalAmount = total + tip;

  return (
    <div
      onClick={onClick}
      className="bg-green-100 border-l-4 border-green-400 text-green-800 px-4 py-3 rounded-lg shadow w-full max-w-xs cursor-pointer hover:bg-green-200 transition"
    >
      <div className="absolute top-2 right-3 text-sm text-green-700 font-semibold">
        💰
      </div>
      <div className="w-full flex justify-center mb-3">
        <div className="w-14 h-14 rounded-full bg-white text-black text-xl font-bold flex items-center justify-center shadow">
          {tableNumber}
        </div>
      </div>
      <div className="text-sm font-bold">Račun zatražen</div>
      <div className="text-md">Račun: {total.toFixed(2)}</div>
      <div className="text-md">Bakšiš: {tip.toFixed(2)}</div>
      <div className="text-md font-semibold">Ukupno: {finalAmount.toFixed(2)}</div>
      <div className="bg-white mt-2 text-green-700 text-2xl uppercase font-semibold rounded-xl px-4 py-2 mb-2 inline-block shadow">
        {method}
      </div>
    </div>
  );
};

export default BillCard;
