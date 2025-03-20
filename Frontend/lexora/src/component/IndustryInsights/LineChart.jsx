import React, { useState } from 'react';
import { ChevronDown, ArrowLeft, Search } from 'lucide-react';

const LineChart = () => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedCategory, setSelectedCategory] = useState('Software Development & Engineering');

  // Job data with role and count
  const jobData = [
    { role: 'Software Development', count: 15000 },
    { role: 'AR/VR Developer', count: 22000 },
    { role: 'QA Engineer', count: 30000 },
    { role: 'Frontend Developer', count: 35000 },
    { role: 'Backend Developer', count: 42000 },
    { role: 'Mobile App Developer', count: 48000 },
    { role: 'DevOps Engineer', count: 49000 },
    { role: 'Machine Learning Engineer', count: 55000 },
    { role: 'Cybersecurity Engineer', count: 60000 },
    { role: 'Data Scientist', count: 70000 },
    { role: 'Cloud Engineer', count: 82000 },
    { role: 'Full-Stack Developer', count: 95000 },
  ];

  // Sort jobs by count
  const sortedJobs = [...jobData].sort((a, b) => a.count - b.count);

  // Find the maximum count for scaling
  const maxCount = Math.max(...sortedJobs.map((job) => job.count));

  return (
    <div className="w-full max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-sm">
      {/* Chart */}
      <div className="relative mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-4 h-4 bg-blue-400 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Count</span>
        </div>

        <div className="flex flex-col gap-2">
          {sortedJobs.map((job) => (
            <div key={job.role} className="flex items-center w-full">
              <div className="w-48 text-sm text-right pr-4">{job.role}</div>
              <div className="flex-1 relative h-8">
                <div
                  className="absolute left-0 top-0 h-full bg-blue-400 rounded"
                  style={{ width: `${(job.count / maxCount) * 100}%` }}
                ></div>
              </div>
              <div className="w-16 text-xs text-gray-500 pl-2">
                {job.count >= 1000 ? `${Math.floor(job.count / 1000)}K` : job.count}
              </div>
            </div>
          ))}
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between mt-2 px-48 text-xs text-gray-500">
          <div>0</div>
          <div>20K</div>
          <div>40K</div>
          <div>60K</div>
          <div>80K</div>
          <div>100K</div>
        </div>
      </div>

      {/* Job role buttons */}
      <div className="grid grid-cols-2 gap-2 mt-8">
        {sortedJobs.map((job) => (
          <button
            key={job.role}
            className="bg-gray-100 text-gray-800 py-3 px-4 rounded-lg text-sm font-medium text-left hover:bg-gray-200 transition-colors"
          >
            {job.role}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LineChart;
