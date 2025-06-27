import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, ChevronDown, Globe, ArrowLeft, TrendingUp, Filter, X } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/Quiztop';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

// Categories for the filter dropdown
const categories = [
  'Software Development & Engineering',
  'Data Science & Analytics',
  'Design & Creative',
  'Marketing & Communications',
  'Business & Management',
  'Healthcare & Medicine',
];

// Countries data
const countries = [
  { name: 'United States', code: 'US' },
  { name: 'Canada', code: 'CA' },
  { name: 'United Kingdom', code: 'UK' },
  { name: 'Australia', code: 'AU' },
  { name: 'Germany', code: 'DE' },
  { name: 'France', code: 'FR' },
  { name: 'Japan', code: 'JP' },
  { name: 'India', code: 'IN' },
];

export default function TrendingJobsPage() {
  const [selectedCategory, setSelectedCategory] = useState('Software Development & Engineering');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [chartTitle, setChartTitle] = useState('Software Engineering Trends');
  const location = useLocation();
  const { predictedScore, totalQuestions, jobRoleName, wrongQuestions, skillName } = location.state || {};
  
  const [learningPath, setLearningPath] = useState([]);
  const [courseLinks, setCourseLinks] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [showLearningPathPopup, setShowLearningPathPopup] = useState(false);
  const chatSessionRef = useRef(null);
  const modalRef = useRef(null);
  const userDetails = JSON.parse(localStorage.getItem('user'));
  const userId = userDetails?.user_id;
  
  // Check if there are wrong questions
  const hasWrongQuestions = wrongQuestions && wrongQuestions.length > 0;

  // Available years for the filter
  const years = ['2023', '2024', '2025', '2026'];

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowLearningPathPopup(false);
      }
    }
    
    if (showLearningPathPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLearningPathPopup]);

  // Initialize Google AI
  useEffect(() => {
    const initAI = async () => {
      const apiKey = "AIzaSyCQUQ9sYtjSjasfpps4bK00hUkqdMwSDV0"; // Replace with your actual API key
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp-image-generation",
        systemInstruction:
          "You are Mentor AI. When the user asks about improving skills based on wrong answers, reply in this format:\n\nLearning Path:\n1. Step one\n2. Step two\n...\n\nCourse Links:\n1. [Course Title](https://example.com)\n2. [Course Title](https://example.com)",
      });

      chatSessionRef.current = model.startChat({
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 2048,
        },
        history: [],
      });
    };

    initAI();
  }, []);

  // Send wrong questions to Google AI when component loads - only if there are wrong questions
  useEffect(() => {
    if (hasWrongQuestions && chatSessionRef.current) {
      getAIRecommendations();
    }
  }, [wrongQuestions, chatSessionRef.current, hasWrongQuestions]);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedYear, selectedCountry]);

  // Update chart title when category changes
  useEffect(() => {
    // Extract first part of category for the title
    const titlePrefix = selectedCategory.split(' & ')[0];
    setChartTitle(`${titlePrefix} Trends`);
  }, [selectedCategory]);

  // Get recommendations from Google AI based on wrong questions
  const getAIRecommendations = async () => {
    if (!hasWrongQuestions) return;
    
    setAiLoading(true);
    
    try {
      // Prepare wrong questions as text
      const wrongQuestionsText = wrongQuestions.map((item, index) => 
        `${index + 1}. Question: ${item.question}\n   Skill: ${item.skillName || 'Not specified'}\n   Correct answer: ${item.correctAnswer}`
      ).join('\n\n');
      
      // Create a prompt for AI
      const prompt = `I'm learning ${jobRoleName}. I need help improving on these questions I got wrong in my assessment:\n\n${wrongQuestionsText}\n\nPlease provide a learning path and course links to help me improve in these areas.`;
      
      // Send to AI
      const result = await chatSessionRef.current.sendMessage(prompt);
      const aiResponse = await result.response.text();
      
      // Parse response
      const [learningPart, coursePart] = aiResponse.split(/Course Links:/i);

      const learningItems = learningPart
        .replace(/Learning Path:/i, '')
        .split('\n')
        .filter((line) => line.trim().match(/^\d+\./));

      const courseItems = coursePart
        ?.split('\n')
        .filter((line) => line.trim().match(/^\d+\./)) || [];

      setLearningPath(learningItems);
      setCourseLinks(courseItems);
    } catch (err) {
      console.error('Error getting AI recommendations:', err);
    } finally {
      setAiLoading(false);
    }
  };

  // Handle dropdown toggle without propagating events
  const toggleDropdown = (setter, currentState, e) => {
    e.stopPropagation();
    setter(!currentState);
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };
  
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const quizOptions = [
    'Manage Component State',
    'Fetch data from API',
    'Manage Form API',
    'Handle Routing'
  ];
  
  // Fixed handleSave function to match backend entity structure
  const handleSave = async () => {
    try {
      // Convert learning path array to a single string for storage
      const learningPathString = hasWrongQuestions && learningPath.length > 0 
        ? learningPath.join('\n') 
        : 'N/A - All questions answered correctly';
      
      // Extract course links to match backend's @ElementCollection List<String>
      const courseLinksArray = courseLinks.map(courseItem => {
        const match = courseItem.match(/\[(.*?)\]\((.*?)\)/);
        return match ? `${match[1]} - ${match[2]}` : courseItem.replace(/^\d+\.\s*/, '');
      });
      
      // If no course links are available, provide default ones
      if (courseLinksArray.length === 0) {
        courseLinksArray.push("Coursera - Web Development Courses - https://www.coursera.com");
        courseLinksArray.push("Unary Learning Platform - https://www.unary.com");
      }
      
      const response = await axios.post(`http://localhost:8080/api/v1/skillScores/user/${userId}`, {
        predictedScore: predictedScore, // Changed from 'score' to match backend entity
        totalQuestions: totalQuestions, // Changed from 'totalScore' to match backend entity
        learningPath: learningPathString,
        courseLinks: courseLinksArray, // Changed from string 'suggestion' to List<String> courseLinks
        jobRoleName: jobRoleName, // Changed from 'jobRole' to match backend entity
        skillName: skillName || (hasWrongQuestions && wrongQuestions[0].skillName) || '' // Changed from 'skills' to match backend entity
      });
      
      console.log('Saved successfully:', response.data);
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };
  
  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
  };

  // Retry AI recommendations - only if there are wrong questions
  const retryAIRecommendations = () => {
    if (hasWrongQuestions) {
      getAIRecommendations();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Fixed Sidebar */}
      <SidebarSub />

      {/* Main Content Area with Independent Scrolling */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <TopHeader />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          
          <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
              <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
                Your Skill Assessment Results
              </h2>
              
              <div className="flex flex-col md:flex-row gap-x-4 gap-y-4 p-6 w-full justify-between items-start">
                <div className="w-full md:w-1/2">
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-600 mb-2">{jobRoleName}</h3>
                    {skillName && <h4 className="font-semibold text-gray-600 mb-2">Skill: {skillName}</h4>}
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700">Quiz Score:</span>
                      <span className="ml-2 font-medium text-blue-600">
                        {predictedScore} / {totalQuestions}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${(predictedScore / totalQuestions) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {hasWrongQuestions ? (
                    aiLoading ? (
                      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-blue-700 flex items-center">
                          <svg className="animate-spin h-5 w-5 mr-3 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating AI recommendations based on your answers...
                        </p>
                      </div>
                    ) : (
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold text-gray-600">AI-Recommended Learning Path</h3>
                          <div className="flex space-x-2">
                            <button 
                              onClick={retryAIRecommendations} 
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                            >
                              Refresh
                            </button>
                            {learningPath.length > 0 && (
                              <button
                                onClick={() => setShowLearningPathPopup(true)}
                                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                              >
                                View Details
                              </button>
                            )}
                          </div>
                        </div>
                        {learningPath.length > 0 ? (
                          <ul className="space-y-2">
                            {learningPath.slice(0, 3).map((item, idx) => (
                              <li key={idx} className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-3">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span className="text-gray-600">{item.replace(/^\d+\.\s*/, '')}</span>
                              </li>
                            ))}
                            {learningPath.length > 3 && (
                              <li className="text-blue-600 text-sm mt-1 cursor-pointer hover:underline" onClick={() => setShowLearningPathPopup(true)}>
                                + {learningPath.length - 3} more steps...
                              </li>
                            )}
                          </ul>
                        ) : (
                          <p className="text-gray-500 italic">Learning path will appear here when generated.</p>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="bg-green-50 p-4 rounded-lg mb-6">
                      <p className="text-green-700 font-medium">Congratulations! You answered all questions correctly. No specific learning path needed!</p>
                    </div>
                  )}
                </div>
                
                <div className="w-full md:w-1/2">
                  {hasWrongQuestions ? (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-600 mb-3">Areas for Improvement</h3>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-3">You had difficulties with these questions:</p>
                        <ul className="space-y-3">
                          {wrongQuestions.map((item, index) => (
                            <li key={index} className="border-b border-red-100 pb-2 last:border-0">
                              <p className="font-medium text-gray-800 text-sm">{index + 1}. {item.question}</p>
                              <p className="text-xs text-gray-500 mt-1">Skill: {item.skillName || 'Not specified'}</p>
                              <p className="text-xs text-green-600 mt-1">Correct answer: {item.correctAnswer}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 p-4 rounded-lg mb-6">
                      <p className="text-green-700">Great job! You answered all questions correctly.</p>
                      <p className="text-green-600 text-sm mt-2">No areas for improvement needed. You've demonstrated an excellent understanding of the material!</p>
                    </div>
                  )}
                </div>
              </div>
              
              {hasWrongQuestions && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-600 mb-2">AI-Recommended Courses</h3>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    {courseLinks.length > 0 ? (
                      <ul className="space-y-2">
                        {courseLinks.map((item, idx) => {
                          const match = item.match(/\[(.*?)\]\((.*?)\)/);
                          return (
                            <li key={idx} className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mr-3">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                              </svg>
                              {match ? (
                                <a href={match[2]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                  {match[1]}
                                </a>
                              ) : (
                                <span className="text-gray-600">{item.replace(/^\d+\.\s*/, '')}</span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-gray-700">Default recommendations:</p>
                        <ul>
                          <li>
                            <a
                              href="https://www.coursera.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mr-2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                              </svg>
                              Coursera - Web Development Courses
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://www.unary.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mr-2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                              </svg>
                              Unary Learning Platform
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="text-center">
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
                  Save Results
                </button>
              </div>
            </div>
          </div>
          
          {/* Learning Path Popup Modal */}
          {showLearningPathPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div ref={modalRef} className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center border-b p-4">
                  <h3 className="text-lg font-semibold text-gray-800">Complete Learning Path</h3>
                  <button 
                    onClick={() => setShowLearningPathPopup(false)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="overflow-y-auto p-6 flex-grow">
                  <h4 className="font-medium text-gray-700 mb-4">AI-Recommended Learning Path for {jobRoleName}</h4>
                  {learningPath.length > 0 ? (
                    <ol className="space-y-4 list-decimal pl-6">
                      {learningPath.map((item, idx) => (
                        <li key={idx} className="text-gray-700">
                          <p>{item.replace(/^\d+\.\s*/, '')}</p>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-gray-500">No learning path available. Try refreshing the recommendations.</p>
                  )}
                </div>
                <div className="border-t p-4 flex justify-end">
                  <button
                    onClick={() => setShowLearningPathPopup(false)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}