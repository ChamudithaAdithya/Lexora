// src/PieChart.jsx
import React from 'react';

const PieChartOne = () => {
  return (
    <div className="flex flex-col items-center mt-10">
      <div className="relative flex items-center justify-center">
        <div className="absolute bg-purple-500 rounded-full h-32 w-32 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">48%</span>
        </div>
        <div className="absolute bg-green-300 rounded-full h-24 w-24 flex items-center justify-center -top-4 -right-4">
          <span className="text-gray-800 text-lg font-semibold">32%</span>
        </div>
        <div className="absolute bg-pink-200 rounded-full h-16 w-16 flex items-center justify-center">
          <span className="text-gray-800 text-xs font-semibold">13%</span>
        </div>
        <div className="absolute bg-green-100 rounded-full h-12 w-12 flex items-center justify-center -bottom-4 -left-4">
          <span className="text-gray-800 text-xs font-semibold">7%</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <span className="text-purple-500">Grocery</span> <span className="text-gray-500">$758.20</span>
        <br />
        <span className="text-green-300">Food & Drink</span> <span className="text-gray-500">$758.20</span>
        <br />
        <span className="text-red-500">Shopping</span> <span className="text-gray-500">$758.20</span>
        <br />
        <span className="text-orange-400">Transportation</span> <span className="text-gray-500">$758.20</span>
      </div>
    </div>
  );
};

export default PieChartOne;
