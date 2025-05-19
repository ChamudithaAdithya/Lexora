import React, { useMemo } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as RechartsRadar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const COLOR_SCALE = ['#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8'];

// Helper to parse salary strings like "$120,000" into numbers
const parseSalary = (salaryStr) => {
  if (typeof salaryStr === 'string') {
    return Number(salaryStr.replace(/[^\d]/g, ''));
  }
  return salaryStr;
};

export default function RadarChartT({ Datatype, DataSet }) {
  // Step 1: Preprocess data based on Datatype
  const RadarData = useMemo(() => {
    if (Datatype === 'Skills') {
      const skillMap = {};
      DataSet.forEach((role) => {
        role.skills.forEach((skill) => {
          if (!skillMap[skill.name]) {
            skillMap[skill.name] = { skill: skill.name, demandScore: 0 };
          }
          skillMap[skill.name].demandScore += skill.count;
        });
      });
      return Object.values(skillMap);
    }

    if (Datatype === 'Jobs') {
      return DataSet.map((job) => ({
        role: job.role,
        count: job.count,
      }));
    }

    if (Datatype === 'Salary') {
      return DataSet.map((job) => ({
        role: job.role,
        minSalary: parseSalary(job.minSalary),
        avgSalary: parseSalary(job.avgSalary),
        maxSalary: parseSalary(job.maxSalary),
      }));
    }

    return [];
  }, [Datatype, DataSet]);

  // Define radar series configuration per Datatype
  const getRadarConfig = () => {
    switch (Datatype) {
      case 'Skills':
        return [
          {
            name: 'Demand Score',
            dataKey: 'demandScore',
            stroke: COLOR_SCALE[2],
            fill: COLOR_SCALE[2],
            fillOpacity: 0.3,
          },
        ];
      case 'Jobs':
        return [
          {
            name: 'Job Count',
            dataKey: 'count',
            stroke: COLOR_SCALE[3],
            fill: COLOR_SCALE[3],
            fillOpacity: 0.3,
          },
        ];
      case 'Salary':
        return [
          {
            name: 'Min Salary',
            dataKey: 'minSalary',
            stroke: COLOR_SCALE[2],
            fill: COLOR_SCALE[2],
            fillOpacity: 0.2,
          },
          {
            name: 'Avg Salary',
            dataKey: 'avgSalary',
            stroke: COLOR_SCALE[3],
            fill: COLOR_SCALE[3],
            fillOpacity: 0.2,
          },
          {
            name: 'Max Salary',
            dataKey: 'maxSalary',
            stroke: COLOR_SCALE[4],
            fill: COLOR_SCALE[4],
            fillOpacity: 0.2,
          },
        ];
      default:
        return [];
    }
  };

  const radarConfig = getRadarConfig();

  if (!RadarData.length || !radarConfig.length) {
    return (
      <div className="h-150 flex items-center justify-center text-gray-500">No data available for radar chart</div>
    );
  }

  // Tooltip renderer
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded">
          <p className="font-bold text-gray-800 mb-2">{label}</p>
          <div className="flex flex-col space-y-1">
            {payload.map((entry, idx) => (
              <p key={idx} className="text-sm">
                <span className="font-medium">{entry.name}: </span>
                <span className="text-gray-700">{entry.value.toLocaleString()}</span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-150">
      <ResponsiveContainer>
        <RadarChart data={RadarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey={Datatype === 'Skills' ? 'skill' : 'role'} />
          <PolarRadiusAxis />
          {radarConfig.map((cfg, i) => (
            <RechartsRadar
              key={i}
              name={cfg.name}
              dataKey={cfg.dataKey}
              stroke={cfg.stroke}
              fill={cfg.fill}
              fillOpacity={cfg.fillOpacity}
            />
          ))}
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
