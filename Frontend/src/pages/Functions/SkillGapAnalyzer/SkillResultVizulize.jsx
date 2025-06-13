import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/SkillGapTop';

const SkillAssessmentRadarChart = () => {
  const { jobRole } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [jobRoleName, setJobRoleName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let userId = null;
  try {
    const userDetails = JSON.parse(localStorage.getItem('user'));
    userId = userDetails?.user_id;
  } catch (e) {
    console.error("Failed to parse user details:", e);
    setError("User not logged in.");
  }

  useEffect(() => {
    const fetchSkillScores = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/skillScores/user/${userId}`);
        const allScores = response.data;
        const filtered = allScores.filter(score => score.jobRoleName === jobRole);

        if (filtered.length === 0) {
          setError('No skill score data found for this job role.');
          return;
        }

        setJobRoleName(filtered[0].jobRoleName);

        const aggregated = filtered.reduce((acc, curr) => {
          const existing = acc.find(item => item.subject === curr.skillName);
          const percentage = (curr.predictedScore / curr.totalQuestions) * 100;

          if (existing) {
            existing.predictedScore += curr.predictedScore;
            existing.totalQuestions += curr.totalQuestions;
            existing.score = (existing.predictedScore / existing.totalQuestions) * 100;
          } else {
            acc.push({
              subject: curr.skillName,
              predictedScore: curr.predictedScore,
              totalQuestions: curr.totalQuestions,
              score: percentage,
            });
          }
          return acc;
        }, []);

        setData(aggregated);
      } catch (err) {
        console.error('Error fetching skill scores:', err);
        setError('Failed to load skill scores.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchSkillScores();
  }, [userId, jobRole]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const { subject, predictedScore, totalQuestions, score } = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-300 shadow text-xs">
          <p><strong>{subject}</strong></p>
          <p>Score: {predictedScore}/{totalQuestions}</p>
          <p>Percentage: {score.toFixed(2)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarSub />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <div className="flex-1 overflow-y-auto p-6 bg-white relative">
          <button
            onClick={handleGoBack}
            className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
          >
            Go Back
          </button>

          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Job Role: {jobRoleName}
          </h2>

          {loading && <p className="text-center text-gray-500">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && !error && data.length > 0 && (
            <>
              <div className="w-full h-96 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'gray', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="Skill Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8 overflow-x-auto">
                <table className="min-w-full border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2">Skill</th>
                      <th className="border px-4 py-2">Predicted Score</th>
                      <th className="border px-4 py-2">Total Questions</th>
                      <th className="border px-4 py-2">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((d, i) => (
                      <tr key={i}>
                        <td className="border px-4 py-2">{d.subject}</td>
                        <td className="border px-4 py-2">{d.predictedScore}</td>
                        <td className="border px-4 py-2">{d.totalQuestions}</td>
                        <td className="border px-4 py-2">{d.score.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {!loading && !error && data.length === 0 && (
            <p className="text-center text-yellow-500">No skill data to display.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillAssessmentRadarChart;
