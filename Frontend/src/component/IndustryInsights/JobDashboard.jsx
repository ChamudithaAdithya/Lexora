import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Search,
  PieChart as PieIcon,
  BarChart as BarIcon,
  LineChart as LineIcon,
  DollarSign,
  ArrowLeft,
  Filter as FilterIcon,
  X,
  Radar,
  LineChartIcon,
  LineChart,
} from 'lucide-react';
import BarChart from './template/charts/BarChart';
import RadarChartT from './template/charts/RadarChartT';
import PieChartT from './template/charts/PieChartT';
import DollarChart from './template/charts/DollarChart';

const JobDashboard = ({ Datatype, jobRole, country, year, dateTime, jobCategory, month, week, chartType }) => {
  const [dataType, setDataType] = useState(Datatype);
  const [jobData, setJobData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2025');
  const [activeChart, setActiveChart] = useState('radar');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredJob, setHoveredJob] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Software Development & Engineering');
  const [isLoading, setIsLoading] = useState(true);
  const [chartTitle, setChartTitle] = useState('Software Engineering Trends');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterRef = useRef(null);
  const API_KEY = 'AIzaSyCp2m0PArqJgaPSGyg6gJQKOigp_SZ7Uis'; // Use the same API key from GoogleAIStudio

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to create a dynamic prompt for Google Gemini API
  // Function to create a dynamic prompt for Google Gemini API
  const createJobDataPrompt = (year, country, jobCategory) => {
    return `Generate realistic IT job market data for the year ${year} in ${country.name}. 
  Focus on the ${jobCategory || selectedCategory} category.
  
  Format the response as a pure JSON array of objects WITHOUT any markdown formatting, code blocks, or backticks. The output should be directly parseable by JSON.parse(). Each object should have the following structure:
  {
    "country":"${country.name}",
    "year": "${
      year != null
        ? year + ' to all 12 months in the year'
        : month != null
        ? month + ' To all weeks within the month'
        : week + ' To all days within the week'
    }",
    "role": "Main Job Title",
    "subRole": "${jobCategory}",
    "jobRole": "Specific Job Function",
    "count": number of available jobs,
    "growthRate": year-over-year percentage growth rate,
    "avgSalary" average annual salary in  ${country.name + 'Currency of the country and with it"s sign'},
    "minSalary"  minimum typical salary in  ${country.name + 'Currency of the country and with it"s sign'},
    "maxSalary"  maximum typical salary in  ${country.name + 'Currency of the country and with it"s sign'},
    "skills": [
      {
        "name": "Skill name",
        "count": number of times this skill appears in this specific job role,
        "overallCount": number of times this skill appears across all job roles
      },
      ... x All the skills that are using in this Job role ${jobCategory}
    ]
  }

  Include at least 15 different IT job roles across these categories:
  - Software Development & Engineering (roles like Software Engineer, Full-Stack Developer, Mobile App Developer, etc.)
  - Data Science & Analytics (Data Scientist, Data Engineer, Business Intelligence Analyst, etc.)
  - Cybersecurity (Security Analyst, Penetration Tester, Security Engineer, etc.)
  - Cloud Computing (Cloud Architect, DevOps Engineer, Site Reliability Engineer, etc.)
  - IT Support & Infrastructure (System Administrator, Network Engineer, IT Support Specialist, etc.)
  - AI & Machine Learning (ML Engineer, AI Researcher, Computer Vision Engineer, etc.)
  - Blockchain & Web3 (Blockchain Developer, Smart Contract Engineer, etc.)
  - Year value is important. Plase be carefull with the months, weeks and dates
  IMPORTANT: Return ONLY the valid JSON array with NO additional text, formatting, or code blocks. The response should start with "[" and end with "]". Do not have duplicate job roles. Order the data according to its year, date, and month.`;
  };

  // Function to fetch data from Google's Gemini API
  // Modify the fetchJobData function to clean the JSON response
  const fetchJobData = async (year, countryObj, category) => {
    setIsLoading(true);
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = createJobDataPrompt(year, countryObj, category);
      const result = await model.generateContent(prompt);
      let text = result.response
        .text()
        .replace(/```json|```/g, '')
        .trim();

      const parsedData = JSON.parse(text);
      const deduped = Array.from(new Map(parsedData.map((item) => [item.role, item])).values());
      console.log('This is the Result how looks like', deduped);
      setJobData(deduped);
    } catch (err) {
      console.error('Failed to fetch job data:', err);
      setJobData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    // Initialize with parameters or defaults
    const yearToUse = dateTime || selectedYear;
    const countryToUse = country || selectedCountry;
    const categoryToUse = jobCategory || selectedCategory;

    fetchJobData(yearToUse, countryToUse, categoryToUse);

    // Update local state to match props if they exist
    if (jobCategory) setSelectedCategory(jobCategory);
  }, [dateTime, country, jobCategory, year, month, week]);

  const toggleDropdown = (setter, state, event) => {
    event.stopPropagation();
    setter(!state);
  };

  // Apply filters button handler
  const handleApplyFilters = () => {
    fetchJobData();
    setShowFilterDropdown(false);
  };

  // Chart tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload) return null;
    const { role, count, growthRate, avgSalary, minSalary, maxSalary } = payload[0].payload;

    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
          <p className="font-semibold text-sm">{role}</p>
        </div>
        <p className="text-sm">Jobs: {count.toLocaleString()}</p>
        <p className="text-sm text-blue-600">Growth: +{growthRate}%</p>
        <p className="text-sm">Avg Salary: ${avgSalary.toLocaleString()}</p>
        <p className="text-sm">Min Salary: ${minSalary.toLocaleString()}</p>
        <p className="text-sm">Max Salary: ${maxSalary.toLocaleString()}</p>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 mt-10">
        <div className="max-w-3xl">
          <div className="mb-6">
            <div className="flex flex-row object-center items-center mb-2">
              <h2 className="ml-6 text-lg font-medium mr-2">
                {year} {country.name} Trending Jobs View
              </h2>
            </div>
          </div>
        </div>
        <div></div>
      </div>

      <div className="bg-white rounded-xl p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {chartType === 'bar' && <BarChart Datatype={Datatype} DataSet={jobData} />}
            {chartType === 'pie' && <PieChartT Datatype={Datatype} DataSet={jobData} />}
            {chartType === 'radar' && <RadarChartT Datatype={Datatype} DataSet={jobData} />}
            {chartType === 'salary' && <DollarChart DataType={Datatype} DataSet={jobData} />}
            {chartType === 'line' && <DollarChart DataType={Datatype} DataSet={jobData} />}
          </>
        )}
      </div>
    </div>
  );
};

export default JobDashboard;
