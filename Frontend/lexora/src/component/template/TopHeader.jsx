import React, { useState, useEffect } from 'react';
import { Globe, ChevronDown, Search, Home, User, Settings, LogOut } from 'lucide-react';

const categories = [
  'Software Development & Engineering',
  'Data Science & Analytics',
  'Design & Creative',
  'Marketing & Communications',
  'Business & Management',
  'Healthcare & Medicine',
];

// Countries for the country selector
const countries = [
  { name: 'Sri Lanka', code: 'LK' },
  { name: 'United States', code: 'US' },
  { name: 'India', code: 'IN' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'Australia', code: 'AU' },
  { name: 'Canada', code: 'CA' },
  { name: 'Singapore', code: 'SG' },
];

export default function TopHeader() {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedYear, selectedCountry]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowYearDropdown(false);
      setShowCountryDropdown(false);
      setShowProfileDropdown(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle dropdown toggle without propagating events
  const toggleDropdown = (setter, currentState, e) => {
    e.stopPropagation();
    setter(!currentState);
  };

  return (
    <>
      <header className="bg-white p-4 shadow-sm z-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">Job Market Insights</h1>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">BETA</span>
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0">
            

            {/* Search input */}
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                placeholder="Search job roles"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg w-full md:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
              />
              <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
              {searchQuery && (
                <button
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchQuery('')}
                >
                  ×
                </button>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2  border-gray-200 rounded-lg px-3 py-2 hover:border-blue-300 transition-colors duration-200 bg-white"
                onClick={(e) => toggleDropdown(setShowProfileDropdown, showProfileDropdown, e)}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  JS
                </div>
                <span className="text-sm font-medium hidden md:inline">John Smith</span>
                <ChevronDown size={14} className="text-gray-500" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-semibold">John Smith</p>
                    <p className="text-xs text-gray-500">john.smith@example.com</p>
                  </div>
                  <ul className="py-1">
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-gray-700">
                      <Home size={16} className="text-gray-500" />
                      <span className="text-sm">Home</span>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-gray-700">
                      <User size={16} className="text-gray-500" />
                      <span className="text-sm">Profile</span>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-gray-700">
                      <Settings size={16} className="text-gray-500" />
                      <span className="text-sm">Settings</span>
                    </li>
                    <li className="border-t border-gray-100 mt-1">
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-red-600">
                        <LogOut size={16} className="text-red-500" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
            <span>›</span>
            <span className="hover:text-blue-600 cursor-pointer">Analytics</span>
            <span>›</span>
            <span className="text-blue-600 font-medium">Job Trends</span>
          </div>
        </div>
      </div>
    </>
  );
}
