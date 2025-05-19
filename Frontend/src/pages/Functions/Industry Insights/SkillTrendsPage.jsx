import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  Globe,
  Calendar,
  Filter,
  BarChart2,
  PieChart,
  LineChart,
  Radar,
  DollarSign,
  Search,
  X,
} from 'lucide-react';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/TopHeader';
import JobDashboard from '../../../component/IndustryInsights/JobDashboard';
import GoogleAIStudio from './Brain/GoogleAIStudio';

// Expanded categories for IT field jobs worldwide
const categories = [
  // Software Development
  'Software Development & Engineering',
  'Mobile App Development',
  'Web Development',
  'DevOps & SRE',
  'Cloud Engineering',
  'Game Development',
  'Embedded Systems',
  'Blockchain Development',

  // Data-focused roles
  'Data Science & Analytics',
  'Machine Learning & AI',
  'Business Intelligence',
  'Data Engineering',
  'Big Data',
  'Database Administration',

  // Security and infrastructure
  'Cybersecurity',
  'Network Engineering',
  'IT Infrastructure',
  'System Administration',

  // Design and product
  'Design & Creative',
  'UI/UX Design',
  'Product Management',
  'Quality Assurance & Testing',

  // Enterprise and business
  'IT Project Management',
  'Enterprise Architecture',
  'Business & Management',
  'IT Consulting',

  // Domain-specific IT
  'Marketing & Communications',
  'Healthcare & Medicine IT',
  'FinTech',
  'EdTech',
];

// Group categories by domain for better organization
const categoryGroups = {
  'Software Development': [
    'Software Development & Engineering',
    'Mobile App Development',
    'Web Development',
    'DevOps & SRE',
    'Cloud Engineering',
    'Game Development',
    'Embedded Systems',
    'Blockchain Development',
  ],
  'Data & Analytics': [
    'Data Science & Analytics',
    'Machine Learning & AI',
    'Business Intelligence',
    'Data Engineering',
    'Big Data',
    'Database Administration',
  ],
  'Security & Infrastructure': ['Cybersecurity', 'Network Engineering', 'IT Infrastructure', 'System Administration'],
  'Design & Product': ['Design & Creative', 'UI/UX Design', 'Product Management', 'Quality Assurance & Testing'],
  'Business & Management': [
    'IT Project Management',
    'Enterprise Architecture',
    'Business & Management',
    'IT Consulting',
  ],
  'Domain-Specific IT': ['Marketing & Communications', 'Healthcare & Medicine IT', 'FinTech', 'EdTech'],
};

// Countries data with flags (using country code for flag emojis)
const countries = [
  { name: 'United States', code: 'US', flag: '🇺🇸' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦' },
  { name: 'United Kingdom', code: 'UK', flag: '🇬🇧' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪' },
  { name: 'France', code: 'FR', flag: '🇫🇷' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵' },
  { name: 'India', code: 'IN', flag: '🇮🇳' },
  { name: 'Singapore', code: 'SG', flag: '🇸🇬' },
  { name: 'Netherlands', code: 'NL', flag: '🇳🇱' },
  { name: 'Israel', code: 'IL', flag: '🇮🇱' },
  { name: 'Sweden', code: 'SE', flag: '🇸🇪' },
  { name: 'Switzerland', code: 'CH', flag: '🇨🇭' },
  { name: 'South Korea', code: 'KR', flag: '🇰🇷' },
  { name: 'Brazil', code: 'BR', flag: '🇧🇷' },
];

// Time-related data
const years = ['2023', '2024', '2025', '2026'];
const months = [
  { name: 'January', value: '01', short: 'Jan' },
  { name: 'February', value: '02', short: 'Feb' },
  { name: 'March', value: '03', short: 'Mar' },
  { name: 'April', value: '04', short: 'Apr' },
  { name: 'May', value: '05', short: 'May' },
  { name: 'June', value: '06', short: 'Jun' },
  { name: 'July', value: '07', short: 'Jul' },
  { name: 'August', value: '08', short: 'Aug' },
  { name: 'September', value: '09', short: 'Sep' },
  { name: 'October', value: '10', short: 'Oct' },
  { name: 'November', value: '11', short: 'Nov' },
  { name: 'December', value: '12', short: 'Dec' },
];

// Get weeks in a month based on the year and month
const getWeeksInMonth = (year, monthIndex) => {
  const weeks = [];
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);

  // Calculate the date for the first Monday (or first day if it's Monday)
  let currentDate = new Date(firstDay);
  if (currentDate.getDay() !== 1) {
    // If not Monday
    currentDate.setDate(currentDate.getDate() - (currentDate.getDay() || 7) + 1);
    // If this moved us before the month, set to first day of month
    if (currentDate < firstDay) {
      currentDate = new Date(firstDay);
    }
  }

  let weekCounter = 1;

  // Add weeks until we pass the end of the month
  while (currentDate <= lastDay) {
    const weekStart = new Date(currentDate);
    const weekEnd = new Date(currentDate);
    weekEnd.setDate(weekEnd.getDate() + 6);

    weeks.push({
      number: weekCounter,
      name: `Week ${weekCounter}`,
      value: weekCounter.toString().padStart(2, '0'),
      start: weekStart,
      end: new Date(Math.min(weekEnd.getTime(), lastDay.getTime())),
    });

    currentDate.setDate(currentDate.getDate() + 7);
    weekCounter++;
  }

  return weeks;
};

// Filter component
const FilterButton = ({ icon: Icon, label, active, onClick, className }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
      active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    } ${className || ''}`}
  >
    {Icon && <Icon size={16} />}
    <span className="text-sm font-medium">{label}</span>
  </button>
);

// Country selector component
const CountrySelector = ({ selectedCountry, setSelectedCountry }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries);

  useEffect(() => {
    if (isOpen) {
      setFilteredCountries(
        countries.filter((country) => country.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
  }, [searchTerm, isOpen]);

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 px-3 py-2 bg-white rounded-md border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe size={16} className="text-blue-600" />
        <span className="text-sm font-medium mr-1">{selectedCountry.flag}</span>
        <span className="text-sm text-gray-700">{selectedCountry.name}</span>
        <ChevronDown size={14} className={`ml-1 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 w-64">
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search countries..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="max-h-60 overflow-y-auto py-1">
            {filteredCountries.map((country) => (
              <div
                key={country.code}
                className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                  selectedCountry.code === country.code ? 'bg-blue-50 text-blue-700' : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCountry(country);
                  setIsOpen(false);
                }}
              >
                <span className="text-sm mr-1">{country.flag}</span>
                <span className="text-sm">{country.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Time period selector component
const TimePeriodSelector = ({
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedWeek,
  setSelectedWeek,
  timeFilterMode,
  setTimeFilterMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [weeks, setWeeks] = useState([]);

  // Update weeks when year or month changes
  useEffect(() => {
    if (selectedMonth) {
      const monthIndex = parseInt(selectedMonth.value) - 1;
      setWeeks(getWeeksInMonth(parseInt(selectedYear), monthIndex));
    }
  }, [selectedYear, selectedMonth]);

  // Set default week when weeks change
  useEffect(() => {
    if (weeks.length > 0 && (!selectedWeek || !weeks.find((w) => w.value === selectedWeek.value))) {
      setSelectedWeek(weeks[0]);
    }
  }, [weeks]);

  // Get display text based on selected time period
  const getTimeDisplayText = () => {
    switch (timeFilterMode) {
      case 'year':
        return selectedYear;
      case 'month':
        return `${selectedMonth.short} ${selectedYear}`;
      case 'week':
        return `Week ${selectedWeek?.value}, ${selectedMonth.short} ${selectedYear}`;
      default:
        return selectedYear;
    }
  };

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 px-3 py-2 bg-white rounded-md border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar size={16} className="text-blue-600" />
        <span className="text-sm text-gray-700">{getTimeDisplayText()}</span>
        <ChevronDown size={14} className={`ml-1 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 w-72">
          {/* Time granularity tabs */}
          <div className="flex bg-gray-50 p-1 rounded-t-md">
            {[
              { id: 'year', label: 'Yearly', icon: Calendar },
              { id: 'month', label: 'Monthly', icon: Calendar },
              { id: 'week', label: 'Weekly', icon: Calendar },
            ].map((period) => (
              <button
                key={period.id}
                className={`flex items-center justify-center gap-1 flex-1 py-1.5 text-xs font-medium rounded transition-all duration-200 ${
                  timeFilterMode === period.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setTimeFilterMode(period.id);
                }}
              >
                <period.icon size={14} />
                {period.label}
              </button>
            ))}
          </div>

          {/* Year selection */}
          <div className="p-3 border-b">
            <div className="text-xs text-gray-500 font-medium mb-2">Year</div>
            <div className="grid grid-cols-4 gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  className={`py-1 text-sm rounded-md transition-all ${
                    selectedYear === year ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedYear(year);
                  }}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Month selection - visible when in month or week mode */}
          {(timeFilterMode === 'month' || timeFilterMode === 'week') && (
            <div className="p-3 border-b">
              <div className="text-xs text-gray-500 font-medium mb-2">Month</div>
              <div className="grid grid-cols-4 gap-2">
                {months.map((month) => (
                  <button
                    key={month.value}
                    className={`py-1 text-xs rounded-md transition-all ${
                      selectedMonth.value === month.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMonth(month);
                    }}
                  >
                    {month.short}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Week selection - visible only in week mode */}
          {timeFilterMode === 'week' && weeks.length > 0 && (
            <div className="p-3 border-b max-h-44 overflow-y-auto">
              <div className="text-xs text-gray-500 font-medium mb-2">Week</div>
              <div className="grid grid-cols-2 gap-2">
                {weeks.map((week) => (
                  <button
                    key={week.value}
                    className={`py-1.5 text-xs rounded-md transition-all ${
                      selectedWeek && selectedWeek.value === week.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWeek(week);
                    }}
                  >
                    {`Week ${week.value} (${week.start.getDate()}-${week.end.getDate()})`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Apply button */}
          <div className="p-2 flex justify-end bg-gray-50 rounded-b-md">
            <button
              className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Time period toggle component
const TimePeriodToggle = ({ timeFilterMode, setTimeFilterMode }) => {
  return (
    <div className="flex bg-gray-100 p-1 rounded-lg shadow-sm">
      {[
        { id: 'year', label: 'Yearly', icon: Calendar },
        { id: 'month', label: 'Monthly', icon: Calendar },
        { id: 'week', label: 'Weekly', icon: Calendar },
      ].map((period) => (
        <button
          key={period.id}
          onClick={() => setTimeFilterMode(period.id)}
          className={`p-2 rounded-md flex items-center gap-1 transition-all duration-200 ${
            timeFilterMode === period.id
              ? 'bg-white shadow-sm text-blue-600'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
          }`}
          title={period.label}
        >
          <period.icon size={16} />
          <span className="text-xs font-medium">{period.label}</span>
        </button>
      ))}
    </div>
  );
};

export default function SkillTrendsPage() {
  const [selectedCategory, setSelectedCategory] = useState('Software Development & Engineering');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);

  const [timeFilterMode, setTimeFilterMode] = useState('year'); // 'year', 'month', 'week'

  const [isLoading, setIsLoading] = useState(true);
  const [chartTitle, setChartTitle] = useState('Software Engineering Skills');
  const [role, setRole] = useState('');
  const [skillsData, setSkillsData] = useState([]);
  const [activeGroup, setActiveGroup] = useState('All');
  const [activeChart, setActiveChart] = useState('bar');

  const { fetchJobData, isLoading: dataLoading } = GoogleAIStudio();

  // Initialize weeks based on selected year and month
  useEffect(() => {
    const monthIndex = parseInt(selectedMonth.value) - 1;
    const newWeeks = getWeeksInMonth(parseInt(selectedYear), monthIndex);
    setWeeks(newWeeks);
    // Set default week if none selected or current selection is invalid
    if (!selectedWeek || !newWeeks.find((w) => w.value === selectedWeek.value)) {
      setSelectedWeek(newWeeks[0]);
    }
  }, [selectedYear, selectedMonth]);

  // Update chart title based on selected category
  useEffect(() => {
    const titlePrefix = selectedCategory.split(' & ')[0];
    setChartTitle(`${titlePrefix} Skills`);
  }, [selectedCategory]);

  // Load skills data when filters change
  useEffect(() => {
    const loadSkillsData = async () => {
      setIsLoading(true);
      const result = await fetchJobData(selectedYear, selectedCountry, selectedCategory);
      if (result.success) {
        setSkillsData(result.data);
      }
      setIsLoading(false);
    };

    loadSkillsData();
  }, [selectedYear, selectedCountry, selectedCategory, selectedMonth, selectedWeek, timeFilterMode]);

  // Filter categories based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(getCategoriesToShow());
    } else {
      const filtered = getCategoriesToShow().filter((category) =>
        category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, activeGroup]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setRole(category); // Set the role for passing to the JobDashboard
  };

  // Get the appropriate list of categories to show based on active group
  const getCategoriesToShow = () => {
    if (activeGroup === 'All') {
      return categories;
    }
    return categoryGroups[activeGroup] || [];
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarSub />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader HeaderMessage={'Skill Trends'} />

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="m-5">
            <div className="mb-6">
              <div className="flex flex-row object-center items-center mb-4">
                <h2 className="text-xl font-semibold mr-2">Worldwide Skill Trends</h2>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 bg-gray-50 p-3 rounded-xl">
                {/* Country Selector */}
                <CountrySelector selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />

                {/* Time Period Selector */}
                <TimePeriodSelector
                  selectedYear={selectedYear}
                  setSelectedYear={setSelectedYear}
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                  selectedWeek={selectedWeek}
                  setSelectedWeek={setSelectedWeek}
                  timeFilterMode={timeFilterMode}
                  setTimeFilterMode={setTimeFilterMode}
                />

                {/* Time Period Toggle */}
                <TimePeriodToggle timeFilterMode={timeFilterMode} setTimeFilterMode={setTimeFilterMode} />

                {/* Search input */}
                <div className="flex relative w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Search categories"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg w-full md:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200 shadow-sm"
                  />
                  <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  {searchQuery && (
                    <button
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      onClick={() => setSearchQuery('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Chart type selector */}
                <div className="flex bg-gray-100 p-1 rounded-lg shadow-sm ml-auto">
                  {[
                    { id: 'bar', label: 'Bar', icon: BarChart2 },
                    { id: 'pie', label: 'Pie', icon: PieChart },
                    { id: 'line', label: 'Line', icon: LineChart },
                    { id: 'radar', label: 'Radar', icon: Radar },
                    { id: 'salary', label: 'Salary', icon: DollarSign },
                  ].map((chart) => (
                    <button
                      key={chart.id}
                      onClick={() => setActiveChart(chart.id)}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        activeChart === chart.id
                          ? 'bg-white shadow-sm text-blue-600'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                      }`}
                      title={chart.label}
                    >
                      <chart.icon className="h-5 w-5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart Content */}
            <div className="p-2  mb-6">
              <JobDashboard
                Datatype={'Skills'}
                role={role}
                country={selectedCountry}
                dateTime={selectedYear}
                month={timeFilterMode === 'month' || timeFilterMode === 'week' ? selectedMonth.value : null}
                week={timeFilterMode === 'week' ? selectedWeek?.value : null}
                jobCategory={selectedCategory}
                chartType={activeChart}
              />
            </div>

            {/* Job Categories Section */}
            <div className="bg-white rounded-lg shadow-sm p-5 mb-5">
              <div className="mb-6">
                <div className="flex flex-row object-center items-center mb-2">
                  <h2 className="text-lg font-medium mr-2">IT Job Categories</h2>
                </div>
                <p className="text-gray-500 text-sm mb-4">Select the job category to view detailed skill insights</p>

                {/* Category group tabs */}
                <div className="flex flex-wrap gap-2 mb-6 bg-gray-50 p-2 rounded-lg">
                  <button
                    className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                      activeGroup === 'All' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveGroup('All')}
                  >
                    All Categories
                  </button>
                  {Object.keys(categoryGroups).map((group) => (
                    <button
                      key={group}
                      className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                        activeGroup === group ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveGroup(group)}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCategories.map((category, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md bg-white border ${
                      selectedCategory === category
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleCategorySelect(category)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span
                          className={`ml-3 font-medium ${
                            selectedCategory === category ? 'text-blue-700' : 'text-gray-700'
                          }`}
                        >
                          {category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
