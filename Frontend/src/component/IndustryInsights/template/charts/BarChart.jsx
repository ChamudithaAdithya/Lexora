import React from 'react';

export default function BarChart({ Datatype, DataSet }) {
  const COLOR_SCALE = ['#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8'];
  const getColorShade = (value, max) => {
    const index = Math.floor((value / max) * (COLOR_SCALE.length - 1));
    return COLOR_SCALE[Math.min(index, COLOR_SCALE.length - 1)];
  };
  const maxCount = Math.max(...DataSet.map((job) => job.count));
  const processedJobs = DataSet.map((job) => ({
    ...job,
    color: getColorShade(job.count, maxCount),
  }));

  return (
    <>
      {Datatype == 'Salary' && (
        <div className="screen-full">
          <p>Salary Trends are not visible in Bar Charts</p>
        </div>
      )}
      {Datatype == 'Jobs' && (
        <div className="space-y-4">
          {processedJobs.map((job) => (
            <div key={job.role} className="flex items-center">
              <div className="w-48 text-sm text-gray-600 pr-4">{job.role}</div>
              <div className="flex-1 h-8 bg-gray-100 rounded-md overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{ width: `${(job.count / maxCount) * 100}%`, backgroundColor: job.color }}
                >
                  <span className="text-white text-sm font-medium pl-2 inline-block pt-1">
                    {job.count.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
