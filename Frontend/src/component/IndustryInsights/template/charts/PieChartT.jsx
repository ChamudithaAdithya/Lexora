import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function PieChartT({ Datatype, DataSet }) {
  const COLOR_SCALE = ['#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8'];

  const getColorShade = (value, max) => {
    const index = Math.floor((value / max) * (COLOR_SCALE.length - 1));
    return COLOR_SCALE[Math.min(index, COLOR_SCALE.length - 1)];
  };

  // Helper to parse salary strings like "$120,000" into numbers
  const parseSalary = (salaryStr) => {
    if (typeof salaryStr === 'string') {
      return Number(salaryStr.replace(/[^\d]/g, ''));
    }
    return salaryStr;
  };

  // Step 1: Preprocess and aggregate data depending on Datatype
  const chartData = useMemo(() => {
    if (Datatype === 'Skills') {
      const skillMap = {};

      DataSet.forEach((role) => {
        role.skills.forEach((skill) => {
          if (!skillMap[skill.name]) {
            skillMap[skill.name] = {
              skill: skill.name,
              maxCount: 0,
              totalCount: 0,
              roles: 0,
            };
          }
          skillMap[skill.name].totalCount += skill.count;
          skillMap[skill.name].roles += 1;
          if (skill.count > skillMap[skill.name].maxCount) {
            skillMap[skill.name].maxCount = skill.count;
          }
        });
      });

      const skillArray = Object.values(skillMap);
      const maxTotal = Math.max(...skillArray.map((s) => s.totalCount));

      return skillArray
        .sort((a, b) => b.totalCount - a.totalCount)
        .slice(0, 25)
        .map((skill) => ({
          name: skill.skill,
          value: skill.totalCount,
          maxCount: skill.maxCount,
          roles: skill.roles,
          color: getColorShade(skill.totalCount, maxTotal),
        }));
    }

    if (Datatype === 'Jobs') {
      const maxCount = Math.max(...DataSet.map((job) => job.count));
      const totalJobs = DataSet.reduce((sum, job) => sum + job.count, 0);

      return [...DataSet]
        .sort((a, b) => b.count - a.count)
        .slice(0, 25)
        .map((job) => ({
          name: job.role,
          value: job.count,
          count: job.count,
          growthRate: job.growthRate,
          avgSalary: parseSalary(job.avgSalary),
          percentage: ((job.count / totalJobs) * 100).toFixed(1),
          color: getColorShade(job.count, maxCount),
        }));
    }

    if (Datatype === 'Salary') {
      // For salary, use the salary range values
      const salaries = DataSet.map((job) => ({
        min: parseSalary(job.minSalary),
        avg: parseSalary(job.avgSalary),
        max: parseSalary(job.maxSalary),
      }));
      const maxVal = Math.max(...salaries.map((s) => s.max));

      return DataSet.sort((a, b) => parseSalary(b.avgSalary) - parseSalary(a.avgSalary))
        .slice(0, 25)
        .map((job) => {
          const min = parseSalary(job.minSalary);
          const avg = parseSalary(job.avgSalary);
          const max = parseSalary(job.maxSalary);
          return {
            name: job.role,
            minSalary: min,
            avgSalary: avg,
            maxSalary: max,
            count: job.count,
            value: avg, // show average salary as slice size
            color: getColorShade(avg, maxVal),
          };
        });
    }

    return [];
  }, [Datatype, DataSet]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      if (Datatype === 'Skills') {
        return (
          <div className="bg-white p-4 border border-gray-200 shadow-lg rounded">
            <p className="font-bold text-gray-800 mb-2">{data.name}</p>
            <div className="flex flex-col space-y-2">
              <p className="text-sm">
                <span className="font-medium">Total Demand: </span>
                <span className="text-gray-700">{data.value.toLocaleString()}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Used In Roles: </span>
                <span className="text-gray-700">{data.roles}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Max Count In Role: </span>
                <span className="text-gray-700">{data.maxCount}</span>
              </p>
            </div>
          </div>
        );
      }

      if (Datatype === 'Jobs') {
        return (
          <div className="bg-white p-4 border border-gray-200 shadow-lg rounded">
            <p className="font-bold text-gray-800 mb-2">{data.name}</p>
            <div className="flex flex-col space-y-2">
              <p className="text-sm">
                <span className="font-medium">Count: </span>
                <span className="text-gray-700">{data.count.toLocaleString()} jobs</span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Market Share: </span>
                <span className="text-gray-700">{data.percentage}%</span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Growth Rate: </span>
                <span className="text-gray-700">{data.growthRate}%</span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Avg Salary: </span>
                <span className="text-gray-700">${data.avgSalary.toLocaleString()}</span>
              </p>
            </div>
          </div>
        );
      }

      if (Datatype === 'Salary') {
        return (
          <div className="bg-white p-4 border border-gray-200 shadow-lg rounded">
            <p className="font-bold text-gray-800 mb-2">{data.name}</p>
            <div className="flex flex-col space-y-2">
              <p className="text-sm">
                <span className="font-medium">Min Salary: </span>
                <span className="text-gray-700">${data.minSalary.toLocaleString()}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Avg Salary: </span>
                <span className="text-gray-700">${data.avgSalary.toLocaleString()}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Max Salary: </span>
                <span className="text-gray-700">${data.maxSalary.toLocaleString()}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Job Count: </span>
                <span className="text-gray-700">{data.count.toLocaleString()}</span>
              </p>
            </div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div>
      <div className="h-126">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={200}
              innerRadius={90}
              paddingAngle={2}
              labelLine={true}
              label={({ name }) => `${name}`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
