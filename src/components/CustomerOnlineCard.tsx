import React from "react";

interface CustomerOnlineCardProps {
  tableNumber: number;
  timeAgo: string; // when they opened the app, e.g. "00:15"
}

const CustomerOnlineCard: React.FC<CustomerOnlineCardProps> = ({
  tableNumber,
  timeAgo,
}) => {
  return (
    <div className="bg-green-100 border-l-4 border-green-500 text-green-900 p-4 rounded-md shadow w-full max-w-xs text-sm mx-auto relative">
      <div className="absolute top-2 right-3 text-[15px] text-green-800 font-semibold">
        ⏱ {timeAgo}
      </div>
      <div className="w-full flex justify-center mb-3">
        <div className="w-14 h-14 rounded-full bg-white text-black text-xl font-bold flex items-center justify-center shadow">
          {tableNumber}
        </div>
      </div>
      <p className="text-sm text-gray-700">
        Customer is browsing the menu.
      </p>
    </div>
  );
};

export default CustomerOnlineCard;