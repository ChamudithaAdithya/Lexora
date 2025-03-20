// src/FocusChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { name: 'Aug', maxFocus: 40, minFocus: 20 },
  { name: 'Sep', maxFocus: 80, minFocus: 30 },
  { name: 'Oct', maxFocus: 60, minFocus: 10 },
  { name: 'Nov', maxFocus: 55, minFocus: 15 },
];

const FocusChart = () => {
  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-center text-xl font-bold mb-4">Focus Analysis</h2>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span className="text-blue-600">Sep</span>
          <span className="text-gray-500">Avg. Concentration</span>
        </div>
        <span className="text-gray-600 text-lg">41%</span>
      </div>
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="maxFocus" stroke="#ff0000" />
        <Line type="monotone" dataKey="minFocus" stroke="#7c4cff" />
      </LineChart>
      <div className="text-center mt-4">
        <span className="inline-block bg-gray-200 px-2 py-1 rounded-full text-sm font-medium">Week 8 Unbalanced</span>
      </div>
    </div>
  );
};

export default FocusChart;
