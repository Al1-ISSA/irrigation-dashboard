import React from "react";

interface LiveCardProps {
  title: string;
  time: string;
  value: string;
  unit?: string;
}

const LiveCard: React.FC<LiveCardProps> = ({ title, time, value, unit }) => {
  return (
    <div className="w-96 border border-black rounded-lg p-6 m-2 ">
      <p className="text-xl text-green-600 font-bold mb-2">{title}</p>
      <p className="text-lg font-bold text-gray-800">{`${value} ${
        unit || ""
      }`}</p>
    </div>
  );
};

export default LiveCard;
