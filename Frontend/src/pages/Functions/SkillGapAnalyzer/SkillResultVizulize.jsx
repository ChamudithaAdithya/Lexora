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
import TopHeader from '../../../component/template/TopHeader';

const SkillAssessmentRadarChart = () => {
  const { jobRole } = useParams();
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [data, setData] = useState([]);
  const [jobRoleName, setJobRoleName] = useState('');
  const [filteredScores, setFilteredScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const userDetails = JSON.parse(localStorage.getItem('user'));
      setUserId(userDetails?.user_id);
    } catch (e) {
      console.error("Failed to parse user details:", e);
      setError("User not logged in.");
      setLoading(false);
    }
  }, []);

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
        setFilteredScores(filtered);

        const aggregated = filtered.reduce((acc, curr) => {
          const existing = acc.find(item => item.subject === curr.skillName);
          const percentage = (curr.predictedScore / curr.totalQuestions) * 100;

          if (existing) {
            existing.predictedScore = curr.predictedScore;
            existing.totalQuestions = curr.totalQuestions;
            existing.score = (existing.predictedScore / existing.totalQuestions) * 100;
          } else {
            acc.push({
              subject: curr.skillName,
              predictedScore: curr.predictedScore,
              totalQuestions: curr.totalQuestions,
              score: percentage,
              learningPath: curr.learningPath,
              courseLinks: curr.courseLinks,
              skillName: curr.skillName
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

  // Handle skill card click - navigate to results page with data
  const handleSkillCardClick = (skillData) => {
    navigate('/fetch', {
      state: {
        predictedScore: skillData.predictedScore,
        totalQuestions: skillData.totalQuestions,
        jobRoleName: jobRoleName,
        skillName: skillData.skillName,
        learningPath: skillData.learningPath || [],
        courseLinks: skillData.courseLinks || [],
        wrongQuestions: [] // You can add wrong questions data if available
      }
    });
  };

  // Helper function to truncate long text
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (typeof text !== 'string') return String(text);
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Helper function to parse learning path steps
  const parseLearningPathSteps = (learningPath) => {
    if (!learningPath) return [];
    if (typeof learningPath !== 'string') return [];
    
    // Split by numbered points (1., 2., 3., etc.) or **bold** markers
    const steps = learningPath
      .split(/\d+\.\s*\*\*|\d+\.\s*/)
      .filter(step => step.trim().length > 0)
      .map(step => step.replace(/\*\*/g, '').trim())
      .slice(0, 6); // Limit to first 6 steps for display
    
    return steps;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const { subject, predictedScore, totalQuestions, score } = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 shadow-lg rounded-lg text-sm">
          <p className="font-semibold text-gray-800">{subject}</p>
          <p className="text-gray-600">Score: {predictedScore}/{totalQuestions}</p>
          <p className="text-blue-600 font-medium">Percentage: {score.toFixed(2)}%</p>
        </div>
      );
    }
    return null;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreColorText = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPerformanceLevel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Needs Improvement';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarSub />
      <div className="flex-1 flex flex-col overflow-hidden">
       <TopHeader HeaderMessage={'Persona Matcher'} />
        <div className="flex-1 overflow-y-auto p-6 bg-white relative">
          <button
            onClick={handleGoBack}
            className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm transition-colors shadow-md"
          >
            Go Back
          </button>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Skill Assessment for: <span className="text-blue-600">{jobRoleName}</span>
          </h2>

          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && data.length > 0 && (
            <>
              {/* Skills Progress Section - Now Clickable */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Skill Performance Overview</h3>
                <p className="text-sm text-gray-600 mb-4">Click on any skill card to view detailed learning recommendations</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {data.map((skill, index) => (
                    <div 
                      key={index} 
                      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105"
                      style={{ width: '250px', height: '100px' }}
                      onClick={() => handleSkillCardClick(skill)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-gray-800 truncate">{skill.subject}</h4>
                        <span className="text-xs text-gray-600">
                          {skill.predictedScore}/{skill.totalQuestions}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span className={`font-medium ${getScoreColorText(skill.score)}`}>
                            {getPerformanceLevel(skill.score)}
                          </span>
                          <span className="font-semibold">{skill.score.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full ${getScoreColor(skill.score)} transition-all duration-500 ease-out rounded-full relative`}
                            style={{ width: `${skill.score}%` }}
                          >
                            <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                          </div>
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className="flex justify-center">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          skill.score >= 80 ? 'bg-green-100 text-green-800' :
                          skill.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          skill.score >= 40 ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {skill.score.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radar Chart */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Skill Radar Chart</h3>
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="w-full h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#374151', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} />
                        <Radar 
                          name="Skill Score" 
                          dataKey="score" 
                          stroke="#3b82f6" 
                          fill="#3b82f6" 
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Tooltip content={<CustomTooltip />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Learning Resources */}
              {/* <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                    </svg>
                    Learning Paths
                  </h3>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {filteredScores.map((score, idx) => {
                      const learningSteps = parseLearningPathSteps(score.learningPath);
                      return (
                        <div key={idx} className="border-b border-gray-100 pb-4 last:border-b-0">
                          <h4 className="font-medium text-gray-800 mb-2">{score.skillName}</h4>
                          {learningSteps.length > 0 ? (
                            <div className="space-y-2">
                              {learningSteps.map((step, stepIdx) => (
                                <div key={stepIdx} className="flex items-start p-2 bg-blue-50 rounded-lg">
                                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center mr-3 mt-0.5">
                                    {stepIdx + 1}
                                  </span>
                                  <span className="text-sm text-gray-700 leading-relaxed">
                                    {truncateText(step, 120)}
                                  </span>
                                </div>
                              ))}
                              {score.learningPath && score.learningPath.length > 500 && (
                                <p className="text-xs text-gray-500 italic mt-2">
                                  Click on the skill card above for complete learning path details
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <span className="text-sm text-gray-700">
                                {truncateText(score.learningPath, 150)}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Course Links
                  </h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {filteredScores.flatMap((score, scoreIdx) => 
                      (score.courseLinks || []).map((link, linkIdx) => (
                        <div key={`${scoreIdx}-${linkIdx}`} className="p-3 bg-green-50 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">{score.skillName}</div>
                          <a 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-green-600 hover:text-green-800 transition-colors flex items-center text-sm"
                          >
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <span className="truncate">{truncateText(link, 40)}</span>
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div> */}
            </>
          )}

          {!loading && !error && data.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-lg">No skill data to display.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillAssessmentRadarChart;