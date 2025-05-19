import React, { useState, useEffect } from 'react';
import { Briefcase, ChevronDown, Globe, ArrowLeft, TrendingUp, Filter } from 'lucide-react';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/SkillGapTop';
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
          <div className=" w-full">
            

            
            

            <div className="border-b-2 border-solid border-gray-300">
            <h1 className="text-2xl font-bold text-gray-800">Choose Your Career Path</h1><br/>
            <p className="text-gray-500 text-sm">Select a role to begin your skill assessment journey</p>
            </div>
        
            <div className="flex flex-row gap-x-4 gap-y-4 p-10 w-full justify-space-between items-start">
  
            <div className="w-full max-w-xs bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-lg mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                    <rect x="9" y="9" width="6" height="6"></rect>
                    <line x1="9" y1="1" x2="9" y2="4"></line>
                    <line x1="15" y1="1" x2="15" y2="4"></line>
                    <line x1="9" y1="20" x2="9" y2="23"></line>
                    <line x1="15" y1="20" x2="15" y2="23"></line>
                    <line x1="20" y1="9" x2="23" y2="9"></line>
                    <line x1="20" y1="14" x2="23" y2="14"></line>
                    <line x1="1" y1="9" x2="4" y2="9"></line>
                    <line x1="1" y1="14" x2="4" y2="14"></line>
                    </svg>
                </div>
      
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Frontend Developer</h3>
                <p className="text-gray-500 text-sm mb-4">Create beautiful, responsive web interfaces</p>
      
                <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">HTML</span>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">CSS</span>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">JavaScript</span>
                </div>
            </div>

            <div className="w-full max-w-xs bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <div className="flex items-center justify-center w-16 h-16 bg-green-50 rounded-lg mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="3" y1="9" x2="21" y2="9"></line>
                        <line x1="9" y1="21" x2="9" y2="9"></line>
                        <path d="M14 15h4"></path>
                        <path d="M14 12h4"></path>
                    </svg>
                </div>
      
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Backend Developer</h3>
                <p className="text-gray-500 text-sm mb-4">Build robust server- side applications</p>
                
                <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">Node.js</span>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">Python</span>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">Java</span>
                </div>
            </div>
        </div>

          </div>
        </div>
      </div>
    </div>
  );
}
