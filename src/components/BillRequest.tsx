import React from "react";

interface BillRequestProps {
  tableNumber: number;
  total: number;
  tip: number;
  method: "cash" | "card";
  timeAgo: string;
}

const BillRequest: React.FC<BillRequestProps> = ({ tableNumber, total, tip, method, timeAgo }) => {
  const finalAmount = total + tip;

  return (
    <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-900 p-4 rounded-md shadow w-full max-w-xs text-sm mx-auto relative">
      <div className="absolute top-2 right-3 text-[15px] text-blue-700 font-semibold">
        ⏱ {timeAgo}
      </div>

      <div className="w-full flex justify-center mb-3">
        <div className="w-14 h-14 rounded-full bg-white text-black text-xl font-bold flex items-center justify-center shadow">
          {tableNumber}
        </div>
      </div>

      <div className="space-y-1 text-sm">
        <div>Total: <span className="font-medium">${total.toFixed(2)}</span></div>
        <div>Tip: <span className="font-medium">${tip.toFixed(2)}</span></div>
        <div className="text-blue-800 font-semibold text-[15px]">
          Total Due: ${finalAmount.toFixed(2)}
        </div>
      </div>

      <div className="mt-3 text-center">
        <div className="inline-block bg-white text-blue-700 text-xs font-semibold px-2 py-[1px] rounded shadow-sm uppercase">
          {method}
        </div>
      </div>
    </div>
  );
};

export default BillRequest;