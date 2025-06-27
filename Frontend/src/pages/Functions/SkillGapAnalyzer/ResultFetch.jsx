import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/TopHeader';

const SkillDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data from navigation state
  const {
    predictedScore,
    totalQuestions,
    jobRoleName,
    skillName,
    learningPath = [],
    courseLinks = [],
    wrongQuestions = []
  } = location.state || {};

  const [activeTab, setActiveTab] = useState('overview');

  // Calculate performance metrics
  const scorePercentage = ((predictedScore / totalQuestions) * 100).toFixed(1);
  const correctAnswers = predictedScore;
  const wrongAnswers = totalQuestions - predictedScore;

  // Helper function to parse learning path steps - same as in your first component
  const parseLearningPathSteps = (learningPath) => {
    if (!learningPath) return [];
    if (typeof learningPath !== 'string') return Array.isArray(learningPath) ? learningPath : [];
    
    // Split by numbered points (1., 2., 3., etc.) or **bold** markers
    const steps = learningPath
      .split(/\d+\.\s*\*\*|\d+\.\s*/)
      .filter(step => step.trim().length > 0)
      .map(step => step.replace(/\*\*/g, '').trim())
      .filter(step => step.length > 0); // Remove empty steps
    
    return steps;
  };

  // Parse the learning path into steps
  const learningPathSteps = parseLearningPathSteps(learningPath);

  // Helper function to truncate long text
  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (typeof text !== 'string') return String(text);
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Data for pie chart
  const pieData = [
    { name: 'Correct', value: correctAnswers, color: '#10b981' },
    { name: 'Incorrect', value: wrongAnswers, color: '#ef4444' }
  ];

  // Data for bar chart comparison
  const barData = [
    {
      name: 'Performance',
      achieved: correctAnswers,
      total: totalQuestions,
      percentage: parseFloat(scorePercentage)
    }
  ];

  const getPerformanceLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 60) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 40) return { level: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { level: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const performance = getPerformanceLevel(parseFloat(scorePercentage));

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleStartLearning = () => {
    // You can implement navigation to learning module here
    console.log('Starting learning for:', skillName);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 shadow-lg rounded-lg">
          <p className="font-semibold">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  if (!location.state) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <SidebarSub />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopHeader HeaderMessage={'Persona Matcher'} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Data Available</h2>
              <p className="text-gray-600 mb-4">Please navigate from the skill assessment page.</p>
              <button
                onClick={handleGoBack}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarSub />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <div className="flex-1 overflow-y-auto p-6">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{skillName}</h1>
                <p className="text-gray-600">Job Role: <span className="font-medium text-blue-600">{jobRoleName}</span></p>
              </div>
              <button
                onClick={handleGoBack}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            </div>

            {/* Performance Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">{scorePercentage}%</div>
                <div className="text-sm opacity-90">Overall Score</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">{correctAnswers}</div>
                <div className="text-sm opacity-90">Correct Answers</div>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">{wrongAnswers}</div>
                <div className="text-sm opacity-90">Incorrect Answers</div>
              </div>
              <div className={`p-4 rounded-lg ${performance.bgColor}`}>
                <div className={`text-2xl font-bold ${performance.color}`}>{performance.level}</div>
                <div className="text-sm text-gray-600">Performance Level</div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { key: 'overview', label: 'Overview', icon: '📊' },
                  { key: 'learning', label: 'Learning Paths', icon: '🎓' },
                  { key: 'courses', label: 'Course Links', icon: '🔗' },
                  { key: 'analysis', label: 'Analysis', icon: '📈' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Score Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Questions Attempted</span>
                      <span className="font-semibold text-gray-800">{totalQuestions}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-600">Correct Answers</span>
                      <span className="font-semibold text-green-600">{correctAnswers}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="text-gray-600">Incorrect Answers</span>
                      <span className="font-semibold text-red-600">{wrongAnswers}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-gray-600">Accuracy Rate</span>
                      <span className="font-semibold text-blue-600">{scorePercentage}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Learning Paths Tab - FIXED */}
            {activeTab === 'learning' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Recommended Learning Paths</h3>
                  <button
                    onClick={handleStartLearning}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Start Learning
                  </button>
                </div>
                
                {learningPathSteps && learningPathSteps.length > 0 ? (
                  <div className="space-y-4">
                    {learningPathSteps.map((step, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 leading-relaxed">
                              {step}
                            </p>
                            <div className="flex items-center text-sm text-gray-600 mt-2">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Recommended for your skill level
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : learningPath && typeof learningPath === 'string' ? (
                  // Fallback: Display raw learning path if parsing fails
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700">
                        {learningPath}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="text-gray-500">No learning paths available for this skill.</p>
                  </div>
                )}
              </div>
            )}

            {/* Course Links Tab */}
            {activeTab === 'courses' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Recommended Courses</h3>
                
                {courseLinks && courseLinks.length > 0 ? (
                  <div className="grid gap-4">
                    {courseLinks.map((link, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-4">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 break-all">{truncateText(link, 60)}</p>
                              <p className="text-sm text-gray-600">External learning resource</p>
                            </div>
                          </div>
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                          >
                            Open Course
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <p className="text-gray-500">No course links available for this skill.</p>
                  </div>
                )}
              </div>
            )}

            {/* Analysis Tab */}
            {activeTab === 'analysis' && (
              <div className="grid gap-6">
                {/* Bar Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Analysis</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="achieved" fill="#10b981" name="Correct Answers" />
                        <Bar dataKey="total" fill="#e5e7eb" name="Total Questions" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommendations</h3>
                  <div className="space-y-4">
                    {parseFloat(scorePercentage) >= 80 ? (
                      <div className="flex items-start p-4 bg-green-50 rounded-lg">
                        <svg className="w-6 h-6 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h4 className="font-medium text-green-800">Excellent Performance!</h4>
                          <p className="text-green-700">You have mastered this skill. Consider mentoring others or exploring advanced topics.</p>
                        </div>
                      </div>
                    ) : parseFloat(scorePercentage) >= 60 ? (
                      <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                        <svg className="w-6 h-6 text-blue-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h4 className="font-medium text-blue-800">Good Progress!</h4>
                          <p className="text-blue-700">You're doing well. Focus on the learning paths provided to reach excellence.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start p-4 bg-yellow-50 rounded-lg">
                        <svg className="w-6 h-6 text-yellow-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                          <h4 className="font-medium text-yellow-800">Needs Improvement</h4>
                          <p className="text-yellow-700">Focus on the recommended learning paths and practice regularly to improve your skills.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          
        </div>
      </div>
    </div>
  );
};

export default SkillDetailPage;