import React from 'react';

const SalaryOverview = () => {
  const salaryData = {
    seniorSalary: 1052.98,
    avgSalary: 900.0,
    minSalary: 700.0,
    maxSalary: 1200.0,
    goal: 1200.0,
  };

  return (
    <div className="max-w-lg mx-auto p-6 shadow-lg border rounded-lg">
      <h2 className="text-lg font-semibold">Salary Overview</h2>
      <div className="relative pt-10">
        <div className="absolute inset-x-0 top-2 flex justify-between">
          <span className="text-sm text-gray-500">${salaryData.minSalary.toFixed(2)}</span>
          <span className="text-sm text-gray-500">${salaryData.maxSalary.toFixed(2)}</span>
        </div>

        <div className="flex justify-center">
          <div className="relative w-52 h-24">
            <svg className="absolute inset-0 transform -rotate-90">
              <circle cx="50%" cy="50%" r="20" stroke="#e5e7eb" strokeWidth="4" fill="none" />
              <circle
                cx="50%"
                cy="50%"
                r="20"
                stroke="#34d399"
                strokeWidth="4"
                strokeDasharray={`${(salaryData.seniorSalary / salaryData.goal) * 100} 100`}
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
              ${salaryData.seniorSalary.toFixed(2)}
            </div>
          </div>
        </div>

        <p className="text-center mt-2 text-sm text-gray-500">of ${salaryData.goal.toFixed(2)} Goal</p>
      </div>

      <div className="mt-4">
        <div className="flex justify-between">
          <span className="text-gray-500">Average Salary:</span>
          <span className="font-semibold">${salaryData.avgSalary.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Senior Salary:</span>
          <span className="font-semibold">${salaryData.seniorSalary.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default SalaryOverview;
