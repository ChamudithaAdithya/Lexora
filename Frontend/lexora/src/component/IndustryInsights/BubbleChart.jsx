import React, { useState, useEffect } from 'react';
import { ChevronDown, ArrowLeft, Search, Info } from 'lucide-react';

const BubbleChart = () => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedCategory, setSelectedCategory] = useState('Software Development & Engineering');
  const [hoveredJob, setHoveredJob] = useState(null);

  // Job data with role, count, and growth rate
  const jobData = [
    { role: 'Software Development', count: 15000, growthRate: 6.2 },
    { role: 'AR/VR Developer', count: 22000, growthRate: 18.5 },
    { role: 'QA Engineer', count: 30000, growthRate: 5.0 },
    { role: 'Frontend Developer', count: 35000, growthRate: 7.8 },
    { role: 'Backend Developer', count: 42000, growthRate: 8.3 },
    { role: 'Mobile App Developer', count: 48000, growthRate: 9.1 },
    { role: 'DevOps Engineer', count: 49000, growthRate: 12.7 },
    { role: 'Machine Learning Engineer', count: 55000, growthRate: 14.2 },
    { role: 'Cybersecurity Engineer', count: 60000, growthRate: 15.8 },
    { role: 'Data Scientist', count: 70000, growthRate: 10.5 },
    { role: 'Cloud Engineer', count: 82000, growthRate: 13.9 },
    { role: 'Full-Stack Developer', count: 95000, growthRate: 11.2 },
  ];

  // Find the maximum count for scaling
  const maxCount = Math.max(...jobData.map((job) => job.count));
  const maxGrowthRate = Math.max(...jobData.map((job) => job.growthRate));

  // Canvas dimensions
  const width = 800;
  const height = 500;
  const padding = 50;

  // Calculate bubble sizes and positions
  const bubbles = jobData.map((job) => {
    // Position based on count (x) and growth rate (y)
    const x = padding + (job.count / maxCount) * (width - 2 * padding);
    const y = height - padding - (job.growthRate / maxGrowthRate) * (height - 2 * padding);
    
    // Size based on job count (logarithmic scale for better visualization)
    const size = 10 + Math.log(job.count) * 4;
    
    return { ...job, x, y, size };
  });

  // Helper function to get a color based on growth rate
  const getColor = (growthRate) => {
    if (growthRate > 15) return "rgb(59, 130, 246)"; // High growth - bright blue
    if (growthRate > 10) return "rgb(96, 165, 250)"; // Medium-high growth
    if (growthRate > 7) return "rgb(147, 197, 253)"; // Medium growth
    return "rgb(191, 219, 254)"; // Lower growth - light blue
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Job Market Demand Visualization</h3>
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <span className="mr-6">
            <span className="inline-block w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
            Bubble size: Job demand
          </span>
          <span>
            <span className="inline-block w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
            Color intensity: Growth rate
          </span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
        {/* Chart Axes */}
        <div className="absolute bottom-0 left-0 w-full border-t border-gray-300"></div>
        <div className="absolute left-0 top-0 h-full border-l border-gray-300"></div>
        
        {/* X-axis labels */}
        <div className="absolute left-0 bottom-2 w-full flex justify-between px-8 text-xs text-gray-500">
          <div>0</div>
          <div>20K</div>
          <div>40K</div>
          <div>60K</div>
          <div>80K</div>
          <div>100K</div>
        </div>
        
        {/* Y-axis labels */}
        <div className="absolute left-2 top-0 h-full flex flex-col justify-between pb-8 text-xs text-gray-500">
          <div>20%</div>
          <div>15%</div>
          <div>10%</div>
          <div>5%</div>
          <div>0%</div>
        </div>
        
        {/* X-axis title */}
        <div className="absolute bottom-10 w-full text-center text-sm font-medium text-gray-600">
          Job Openings
        </div>
        
        {/* Y-axis title */}
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-8 text-sm font-medium text-gray-600"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}
        >
          Growth Rate (%)
        </div>

        {/* Bubbles */}
        {bubbles.map((bubble, index) => (
          <div
            key={index}
            className="absolute rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow-sm hover:shadow"
            style={{
              left: `${bubble.x}px`,
              top: `${bubble.y}px`,
              width: `${bubble.size * 2}px`,
              height: `${bubble.size * 2}px`,
              backgroundColor: getColor(bubble.growthRate),
              transform: `translate(-${bubble.size}px, -${bubble.size}px)`,
              opacity: hoveredJob === bubble.role || hoveredJob === null ? 1 : 0.4,
              zIndex: hoveredJob === bubble.role ? 10 : 1
            }}
            onMouseEnter={() => setHoveredJob(bubble.role)}
            onMouseLeave={() => setHoveredJob(null)}
          >
            {(bubble.size > 25 || hoveredJob === bubble.role) && (
              <span className="text-xs font-medium text-white text-center px-1">
                {bubble.role.length > 10 && bubble.size < 30 ? 
                  bubble.role.substring(0, 8) + "..." : 
                  bubble.role}
              </span>
            )}
          </div>
        ))}

        {/* Tooltip */}
        {hoveredJob && (
          <div 
            className="absolute bg-white p-3 rounded-lg shadow-lg border border-gray-200 z-20 w-48"
            style={{
              left: `${bubbles.find(b => b.role === hoveredJob).x}px`,
              top: `${bubbles.find(b => b.role === hoveredJob).y - 80}px`,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="font-medium text-gray-800">{hoveredJob}</div>
            <div className="text-sm text-gray-600 mt-1">
              Openings: {(bubbles.find(b => b.role === hoveredJob).count).toLocaleString()}
            </div>
            <div className="text-sm text-blue-600 font-medium">
              Growth: +{bubbles.find(b => b.role === hoveredJob).growthRate}%
            </div>
          </div>
        )}
      </div>

      {/* Job role buttons */}
      <div className="grid grid-cols-3 gap-2 mt-8">
        {jobData.map((job) => (
          <button
            key={job.role}
            className={`py-3 px-4 rounded-lg text-sm font-medium text-left transition-colors border ${
              hoveredJob === job.role
                ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600'
            }`}
            onMouseEnter={() => setHoveredJob(job.role)}
            onMouseLeave={() => setHoveredJob(null)}
          >
            {job.role}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BubbleChart;