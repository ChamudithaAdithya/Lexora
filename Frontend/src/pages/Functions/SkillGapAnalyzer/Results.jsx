import React, { useState, useEffect } from 'react';
import { Briefcase, ChevronDown, Globe, ArrowLeft, TrendingUp, Filter } from 'lucide-react';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/Quiztop';
import LineChart from '../../../component/IndustryInsights/LineChart';
import BubbleChart from '../../../component/IndustryInsights/BubbleChart';
import JobDashboard from '../../../component/IndustryInsights/JobDashboard';
import FocusChart from '../../../component/IndustryInsights/charts/FocusChart';
import PieChartOne from '../../../component/IndustryInsights/charts/PieChartOne';

// Categories for the filter dropdown
const categories = [
  'Software Development & Engineering',

  'Data Science & Analytics',
  'Design & Creative',
  'Marketing & Communications',
  'Business & Management',
  'Healthcare & Medicine',
];

// Countries data that was missing
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

  // Available years for the filter
  const years = ['2023', '2024', '2025', '2026'];

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

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);}

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
          {/* Chart Content */}
          
          <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
          Your Skill Assessment Results
        </h2><div className="flex flex-row gap-x-4 gap-y-4 p-10 w-full justify-space-between items-start"><div>
        <div className="mb-6">
          <h3 className="font-semibold text-gray-600 mb-2">Performance Overview</h3>
          <div className="flex items-center">
            <span className="font-medium text-gray-700">Quiz Score:</span>
            <span className="ml-2 font-medium text-blue-600">1 / 2</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "50%" }}></div>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold text-gray-600 mb-2">Recommended Learning Paths</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span className="text-gray-600">HTML</span>
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span className="text-gray-600">CSS Basics</span>
            </li>
          </ul>
        </div></div></div>
        <div className="mb-6">
          <h3 className="font-semibold text-gray-600 mb-2">Next Steps</h3>
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Online Courses</p>
            <ul>
              <li>
                <a
                  href="https://www.coursera.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  https://www.coursera.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.unary.com/team/jncsdjibne2321qwd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  https://www.unary.com/team/jncsdjibne2321qwd
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center">
          <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
            View Analysis Result
          </button>
        </div>
      </div>
    </div>
          {/* Quick Stats Section - Dynamic based on selected category */}
          <div >

        
          </div>
        </div>
      </div>
    </div>
  );
}
