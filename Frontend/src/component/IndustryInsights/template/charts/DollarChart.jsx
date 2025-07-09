import React from 'react';
import { AreaChart, Area, CartesianGrid, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function DollarChart({ DataSet, DataType }) {
  // Colors for different skills
  const SKILL_COLORS = [
    '#1E40AF',
    '#3B82F6',
    '#60A5FA',
    '#93C5FD',
    '#BFDBFE',
    '#2563EB',
    '#1D4ED8',
    '#1E3A8A',
    '#0369A1',
    '#0284C7',
  ];

  // Process data to ensure proper format
  const processData = () => {
    if (!DataSet) return [];

    // Skills data processing
    if (DataType === 'Skills') {
      // Check if DataSet is an object with skills array
      if (DataSet && DataSet.skills && Array.isArray(DataSet.skills)) {
        // Generate yearly trend data for each skill
        const currentYear = new Date().getFullYear();
        const skillsData = [];

        // Create time series for the past 5 years
        for (let yearOffset = -4; yearOffset <= 0; yearOffset++) {
          const year = currentYear + yearOffset;
          const yearData = { year: year.toString() };

          // Add each skill's data with simulated growth trend
          DataSet.skills.forEach((skill) => {
            const growthFactor = 1 + 0.1 * yearOffset + Math.random() * 0.05; // Random variation in growth
            yearData[skill.name] = Math.round(skill.count * growthFactor);
            // Store count data for reference
            yearData[`${skill.name}_count`] = Math.round(skill.count * growthFactor);
          });

          skillsData.push(yearData);
        }

        return skillsData;
      }
      return [];
    }

    // Salary data processing
    else {
      // If DataSet is an array, process each item
      if (Array.isArray(DataSet)) {
        return DataSet.map((item) => ({
          ...item,
          maxSalary:
            typeof item.maxSalary === 'string' ? Number(item.maxSalary.replace(/[$,]/g, '')) : item.maxSalary || 0,
          minSalary:
            typeof item.minSalary === 'string' ? Number(item.minSalary.replace(/[$,]/g, '')) : item.minSalary || 0,
          avgSalary:
            typeof item.avgSalary === 'string' ? Number(item.avgSalary.replace(/[$,]/g, '')) : item.avgSalary || 0,
          Maximum: typeof item.Maximum === 'string' ? Number(item.Maximum.replace(/[$,]/g, '')) : item.Maximum,
          Median: typeof item.Median === 'string' ? Number(item.Median.replace(/[$,]/g, '')) : item.Median,
        }));
      }
      // If DataSet is a single object, create a year series
      else if (DataSet && typeof DataSet === 'object') {
        const yearSeries = [];
        const currentYear = new Date().getFullYear();

        for (let i = -4; i <= 0; i++) {
          const yearOffset = i * 0.05; // 5% difference per year
          const growthMultiplier = 1 + yearOffset;

          yearSeries.push({
            year: (currentYear + i).toString(),
            maxSalary: Number((DataSet.maxSalary || '0').toString().replace(/[$,]/g, '')) * growthMultiplier,
            minSalary: Number((DataSet.minSalary || '0').toString().replace(/[$,]/g, '')) * growthMultiplier,
            avgSalary: Number((DataSet.avgSalary || '0').toString().replace(/[$,]/g, '')) * growthMultiplier,
          });
        }

        return yearSeries;
      }

      return [];
    }
  };

  const processedData = processData();

  // Determine which fields to display based on what's available in the data
  const getChartConfig = () => {
    if (!processedData || processedData.length === 0) return { areas: [], lines: [] };

    const sampleData = processedData[0];
    const config = {
      areas: [],
      lines: [],
    };

    // For Skills DataType, create chart elements for each skill
    if (DataType === 'Skills' && DataSet && DataSet.skills) {
      DataSet.skills.forEach((skill, index) => {
        const colorIndex = index % SKILL_COLORS.length;
        const color = SKILL_COLORS[colorIndex];

        config.areas.push({
          dataKey: skill.name,
          name: skill.name,
          stroke: color,
          fill: `url(#skill${index})`,
          gradientId: `skill${index}`,
          gradientColor: color,
        });
      });
    }
    // For Salary DataType
    else {
      // Add areas if they exist in data
      if (sampleData.maxSalary !== undefined) {
        config.areas.push({
          dataKey: 'maxSalary',
          name: 'Senior Level',
          stroke: '#1E40AF',
          fill: 'url(#seniorColor)',
          gradientId: 'seniorColor',
          gradientColor: '#1E40AF',
        });
      }

      if (sampleData.avgSalary !== undefined) {
        config.areas.push({
          dataKey: 'avgSalary',
          name: 'Average Level',
          stroke: '#3B82F6',
          fill: 'url(#avgColor)',
          gradientId: 'avgColor',
          gradientColor: '#3B82F6',
        });
      }

      if (sampleData.minSalary !== undefined) {
        config.areas.push({
          dataKey: 'minSalary',
          name: 'Entry Level',
          stroke: '#60A5FA',
          fill: 'url(#entryColor)',
          gradientId: 'entryColor',
          gradientColor: '#60A5FA',
        });
      }

      // Add lines if they exist in data
      if (sampleData.Maximum !== undefined) {
        config.lines.push({
          dataKey: 'Maximum',
          name: 'Maximum',
          stroke: '#0F172A',
          strokeWidth: 2,
        });
      }

      if (sampleData.Median !== undefined) {
        config.lines.push({
          dataKey: 'Median',
          name: 'Median',
          stroke: '#0369A1',
          strokeWidth: 2,
          strokeDasharray: '5 5',
        });
      }
    }

    return config;
  };

  const chartConfig = getChartConfig();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded">
          <p className="font-bold text-gray-800 mb-2">{`Year: ${label}`}</p>
          {payload.map((entry, index) => {
            // Find the count data for this skill if available
            const countKey = `${entry.dataKey}_count`;
            const hasCountData = DataType === 'Skills' && payload[0].payload && payload[0].payload[countKey];

            return (
              <div key={`item-${index}`} className="flex items-center mb-1">
                <div className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <p className="text-sm">
                  <span className="font-medium">{entry.name}: </span>
                  <span className="text-gray-700">
                    {DataType === 'Skills'
                      ? `${Math.round(entry.value).toLocaleString()} jobs`
                      : `$${Math.round(entry.value).toLocaleString()}`}
                  </span>
                  {hasCountData && (
                    <span className="text-gray-500 text-xs ml-2">
                      ({Math.round((entry.value / DataSet.count) * 100)}% of role)
                    </span>
                  )}
                </p>
              </div>
            );
          })}

          {DataType === 'Skills' && DataSet && (
            <p className="text-xs text-gray-500 mt-2">
              Total jobs in {DataSet.role}: {DataSet.count.toLocaleString()}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Don't render if there's no data
  if (!processedData || processedData.length === 0) {
    return (
      <div className="p-4 rounded flex items-center justify-center h-80">
        <p className="text-gray-500">No data available to display</p>
      </div>
    );
  }

  // Get y-axis label based on data type
  const getYAxisLabel = () => {
    if (DataType === 'Skills') {
      return (value) => `${Math.round(value / 1000)}k jobs`;
    } else {
      return (value) => `$${Math.round(value / 1000)}k`;
    }
  };

  return (
    <div className="p-4 rounded">
      <div className="h-80">
        {DataType !== 'Jobs' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={processedData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <defs>
                {chartConfig.areas.map((area) => (
                  <linearGradient key={area.gradientId} id={area.gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={area.gradientColor} stopOpacity={0.6} />
                    <stop offset="95%" stopColor={area.gradientColor} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={getYAxisLabel()} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {chartConfig.areas.map((area, index) => (
                <Area
                  key={index}
                  type="monotone"
                  dataKey={area.dataKey}
                  name={area.name}
                  stroke={area.stroke}
                  fill={area.fill}
                />
              ))}

              {chartConfig.lines.map((line, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={line.dataKey}
                  name={line.name}
                  stroke={line.stroke}
                  strokeWidth={line.strokeWidth}
                  strokeDasharray={line.strokeDasharray}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
