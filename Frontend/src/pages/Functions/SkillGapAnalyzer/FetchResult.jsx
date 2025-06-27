import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/TopHeader';

export default function TrendingJobsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Software Development & Engineering');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [isLoading, setIsLoading] = useState(true);
  const [jobRoles, setJobRoles] = useState([]);
  const [error, setError] = useState(null);

  const userDetails = JSON.parse(localStorage.getItem('user'));
  const userId = userDetails?.user_id;

  useEffect(() => {
    const fetchSkillScores = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/skillScores/user/${userId}`);
        const scores = response.data;

        if (scores && scores.length > 0) {
          const jobRoleMap = new Map();

          scores.forEach(score => {
            const jobRoleName = score.jobRoleName;

            if (!jobRoleMap.has(jobRoleName)) {
              jobRoleMap.set(jobRoleName, {
                jobRoleName,
                skills: [],
                totalScore: 0,
                totalQuestions: 0,
              });
            }

            const jobRole = jobRoleMap.get(jobRoleName);
            jobRole.skills.push({
              skillName: score.skillName,
              score: score.predictedScore,
              totalQuestions: score.totalQuestions,
              percentage: Math.round((score.predictedScore / score.totalQuestions) * 100),
              learningPath: score.learningPath,
              courseLinks: score.courseLinks
            });

            jobRole.totalScore += score.predictedScore;
            jobRole.totalQuestions += score.totalQuestions;
          });

          const processedJobRoles = Array.from(jobRoleMap.values()).map(jobRole => ({
            ...jobRole,
            averagePercentage: Math.round((jobRole.totalScore / jobRole.totalQuestions) * 100),
            skillCount: jobRole.skills.length
          }));

          setJobRoles(processedJobRoles);
        } else {
          setError('No skill score data found');
        }
      } catch (error) {
        console.error('Error fetching skill scores:', error);
        setError('Failed to load skill scores. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchSkillScores();
    } else {
      setError('User ID not found. Please log in again.');
      setIsLoading(false);
    }
  }, [userId]);

  const handleJobRoleClick = (jobRole) => {
    navigate(`/result/${encodeURIComponent(jobRole.jobRoleName)}`, {
      state: {
        jobRoleData: jobRole
      }
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarSub />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader HeaderMessage={'Persona Matcher'} />
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="w-full">
            <div className="border-b-2 border-solid border-gray-300 mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Your Skill Assessment Results</h1>
              <p className="text-gray-500 text-sm">Review your performance across different job roles</p>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center p-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="ml-4 text-gray-600">Loading your skill assessments...</p>
              </div>
            ) : error ? (
              <div className="p-10 text-center text-red-500">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-lg font-medium mb-2">Oops! Something went wrong</p>
                <p className="text-sm mb-4">{error}</p>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {jobRoles.length > 0 ? (
                  jobRoles.map((jobRole, index) => (
                    <div
                      key={`${jobRole.jobRoleName}-${index}`}
                      onClick={() => handleJobRoleClick(jobRole)}
                      className="bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                            {jobRole.jobRoleName}
                          </h3>

                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Overall Score:</span>
                              <span className={`text-sm font-medium ${
                                jobRole.averagePercentage >= 80 ? 'text-green-600' :
                                jobRole.averagePercentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {jobRole.averagePercentage}%
                              </span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  jobRole.averagePercentage >= 80 ? 'bg-green-500' :
                                  jobRole.averagePercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${jobRole.averagePercentage}%` }}
                              ></div>
                            </div>

                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>{jobRole.skillCount} skill{jobRole.skillCount !== 1 ? 's' : ''}</span>
                              <span>{jobRole.totalScore}/{jobRole.totalQuestions} questions</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-blue-600 group-hover:text-blue-800 transition-colors">
                          Click to view detailed results →
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center p-12">
                    <div className="mb-4">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
                    <p className="text-gray-500 mb-4">You haven't taken any skill assessments yet.</p>
                    <button
                      onClick={() => navigate('/skills')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Take Your First Assessment
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
