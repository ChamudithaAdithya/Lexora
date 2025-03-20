import React, { useState, useEffect } from 'react';
import { Briefcase, ChevronDown, Globe, ArrowLeft, TrendingUp, Filter } from 'lucide-react';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/TopHeader';
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
  const [showYearDropdown, setShowYearDropdown] = useState(false);
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
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Chart Container */}
            <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden border border-gray-200">
              {/* Title and Filters Section */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex flex-wrap justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      <Briefcase size={20} className="inline mr-2 text-blue-500" />
                      {chartTitle}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Job market demand by role in {selectedYear}</p>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
                    {/* Year filter */}
                    <div className="relative">
                      <button
                        className="px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2 text-sm font-medium bg-white hover:bg-gray-50 transition-colors duration-200"
                        onClick={(e) => toggleDropdown(setShowYearDropdown, showYearDropdown, e)}
                      >
                        <span className="text-gray-700">{selectedYear}</span>
                        <ChevronDown size={14} className="text-gray-500" />
                      </button>

                      {/* Year Dropdown */}
                      {showYearDropdown && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                          {years.map((year) => (
                            <div
                              key={year}
                              className={`px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm ${
                                year === selectedYear ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                              }`}
                              onClick={() => {
                                setSelectedYear(year);
                                setShowYearDropdown(false);
                              }}
                            >
                              {year}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Country selector */}
                    <div className="relative">
                      <button
                        className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 hover:border-blue-300 transition-colors duration-200 bg-white"
                        onClick={(e) => toggleDropdown(setShowCountryDropdown, showCountryDropdown, e)}
                      >
                        <Globe size={16} className="text-blue-500" />
                        <span className="text-sm font-medium">{selectedCountry.name}</span>
                        <ChevronDown size={14} className="text-gray-500 ml-1" />
                      </button>

                      {/* Country Dropdown */}
                      {showCountryDropdown && (
                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto">
                          {countries.map((country) => (
                            <div
                              key={country.code}
                              className={`px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm ${
                                country.code === selectedCountry.code
                                  ? 'bg-blue-50 text-blue-600 font-medium'
                                  : 'text-gray-700'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCountry(country);
                                setShowCountryDropdown(false);
                                setIsLoading(true);
                              }}
                            >
                              {country.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* All Analytics button */}
                    <button className="flex items-center gap-2 text-sm font-medium border border-gray-200 px-4 py-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors duration-200 bg-white">
                      <ArrowLeft size={14} />
                      Go Back
                    </button>
                  </div>
                </div>
              </div>

              {/* Chart Content */}
              <div className="p-6">
                <JobDashboard />
              </div>

              {/* Chart Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-blue-500" />
                  <span>Data updated on March 5, 2025</span>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium">Export Data</button>
              </div>
            </div>

            {/* Category Selection Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-medium text-gray-800">Popular Job Categories</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`py-3 px-4 rounded-lg text-sm font-medium text-left transition-all duration-200 border ${
                      category === selectedCategory
                        ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats Section - Dynamic based on selected category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Highest Demand</h4>
                <p className="text-xl font-semibold text-gray-800">
                  {selectedCategory === 'Software Development & Engineering'
                    ? 'Full-Stack Developer'
                    : selectedCategory === 'Data Science & Analytics'
                    ? 'Data Engineer'
                    : selectedCategory === 'Design & Creative'
                    ? 'UX/UI Designer'
                    : selectedCategory === 'Marketing & Communications'
                    ? 'Digital Marketing Specialist'
                    : selectedCategory === 'Business & Management'
                    ? 'Product Manager'
                    : 'Healthcare Informatics Specialist'}
                </p>
                <div className="flex items-center mt-2 text-green-600 text-sm">
                  <TrendingUp size={14} className="mr-1" />
                  <span>+12.3% growth since last year</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Average Salary</h4>
                <p className="text-xl font-semibold text-gray-800">
                  {selectedCategory === 'Software Development & Engineering'
                    ? '$82,500 USD'
                    : selectedCategory === 'Data Science & Analytics'
                    ? '$95,200 USD'
                    : selectedCategory === 'Design & Creative'
                    ? '$76,800 USD'
                    : selectedCategory === 'Marketing & Communications'
                    ? '$68,400 USD'
                    : selectedCategory === 'Business & Management'
                    ? '$89,600 USD'
                    : '$110,200 USD'}
                </p>
                <div className="flex items-center mt-2 text-green-600 text-sm">
                  <TrendingUp size={14} className="mr-1" />
                  <span>+5.8% increase from 2024</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Job Openings</h4>
                <p className="text-xl font-semibold text-gray-800">
                  {selectedCategory === 'Software Development & Engineering'
                    ? '18,342'
                    : selectedCategory === 'Data Science & Analytics'
                    ? '12,756'
                    : selectedCategory === 'Design & Creative'
                    ? '9,843'
                    : selectedCategory === 'Marketing & Communications'
                    ? '14,268'
                    : selectedCategory === 'Business & Management'
                    ? '16,590'
                    : '21,437'}
                </p>
                <div className="flex items-center mt-2 text-blue-600 text-sm">
                  <Filter size={14} className="mr-1" />
                  <span>View openings by location</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
