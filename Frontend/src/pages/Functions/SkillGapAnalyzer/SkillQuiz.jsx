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
          

          {/* Quick Stats Section - Dynamic based on selected category */}
          <div >
            

            
            

            <div className="border-b-2 border-solid border-gray-300">
            <h1 className="text-2xl font-bold text-gray-800">Frontend Developer Quiz</h1><br/>
            
            </div>
        
            <div className="w-[80%] mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-6">What Does React's useState hook do?</h2>
      
      <div className="space-y-4 mb-6">
        {quizOptions.map((option) => (
          <div 
            key={option} 
            className={`border rounded-lg p-3 cursor-pointer transition-colors duration-200 ${
              selectedAnswer === option 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleAnswerSelect(option)}
          >
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="quiz-option" 
                className="mr-3 hidden" 
                checked={selectedAnswer === option}
                onChange={() => handleAnswerSelect(option)}
              />
              <span className={`w-4 h-4 mr-3 rounded-full border-2 ${
                selectedAnswer === option 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'
              }`}></span>
              {option}
            </label>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end">
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          disabled={!selectedAnswer}
        >
          Next
        </button>
      </div>
    </div>

          </div>
        </div>
      </div>
    </div>
  );
}
