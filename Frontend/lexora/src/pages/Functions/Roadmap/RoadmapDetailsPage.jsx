import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Home,
  StickyNote,
  Layers,
  Calendar,
  LifeBuoy,
  Settings,
  FileCog,
  Users,
  BarChart3,
  FileCheck,
  Bell,
  ChevronDown,
  Search,
  ArrowLeft,
  Globe,
  Filter,
  TrendingUp,
  Briefcase,
  User,
  LogOut,
  Download,
  Share2,
  Info,
  Sliders,
} from 'lucide-react';
import Sidebar, { SidebarItem, SidebarSubItem } from '../../../component/template/Sidebar';
import Roadmap from '../../../component/Roadmaps/Roadmap';
import SearchRoadmap from '../../../component/Roadmaps/SearchRoadmap';

// Categories for the filter dropdown
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

export default function RoadmapDetailsPage() {
  const [selectedCategory, setSelectedCategory] = useState('Software Development & Engineering');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2025');
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Available years for the filter
  const years = ['2023', '2024', '2025', '2026'];

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
      setShowCategoryDropdown(false);
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
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Fixed Sidebar */}
      <div className="h-screen flex-shrink-0">
        <Sidebar>
          <SidebarItem icon={<Home size={20} />} text="Home" />
          <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active />

          <SidebarItem icon={<StickyNote size={20} />} text="Projects" alwaysOpen={true}>
            <SidebarSubItem text="Active Projects" active />
            <SidebarSubItem text="Archived Projects" />
            <SidebarSubItem text="Templates" />
          </SidebarItem>

          <SidebarItem icon={<Calendar size={20} />} text="Calendar" />

          <SidebarItem icon={<Layers size={20} />} text="Tasks">
            <SidebarSubItem text="My Tasks" />
            <SidebarSubItem text="Assigned Tasks" />
            <SidebarSubItem text="Completed" />
          </SidebarItem>

          <SidebarItem icon={<Users size={20} />} text="Team">
            <SidebarSubItem text="Members" />
            <SidebarSubItem text="Permissions" />
          </SidebarItem>

          <SidebarItem icon={<BarChart3 size={20} />} text="Reports">
            <SidebarSubItem text="Analytics" />
            <SidebarSubItem text="Exports" />
            <SidebarSubItem text="Performance" />
          </SidebarItem>

          <SidebarItem icon={<Bell size={20} />} text="Notifications" alert />

          <hr className="my-3 border-gray-200" />

          <SidebarItem icon={<Settings size={20} />} text="Settings">
            <SidebarSubItem text="Account" />
            <SidebarSubItem text="Notifications" />
            <SidebarSubItem text="Appearance" />
          </SidebarItem>

          <SidebarItem icon={<FileCog size={20} />} text="Admin">
            <SidebarSubItem text="User Management" />
            <SidebarSubItem text="System Settings" />
          </SidebarItem>

          <SidebarItem icon={<LifeBuoy size={20} />} text="Help" />
          <SidebarItem icon={<FileCheck size={20} />} text="Documentation" />
        </Sidebar>
      </div>

      {/* Main Content Area with Independent Scrolling */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <header className="bg-white p-4 shadow-sm z-10 border-b border-gray-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-800">Roadmap Generator</h1>
            </div>

            <div className="flex items-center gap-3 mt-4 md:mt-0">
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
              <span className="text-blue-600 font-medium">Generate Roadmap</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Chart Container */}
            <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden border border-gray-200 bg-gradient-to-r from-blue-50 to-white">
             

              {/* Chart Content with Loading State */}
              <div className="p-6 min-h-96">
                {isLoading ? (
                  <div className="flex items-center justify-center h-80">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <RoadmapDetails/>
                )}
              </div>

              
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 