import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import axios from 'axios';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/SkillGapTop';

// Replace these placeholders when you add actual chart components


const LineChart = () => null;
const BubbleChart = () => null;
const JobDashboard = () => null;
const FocusChart = () => null;
const PieChartOne = () => null;

const categories = [
  'Software Development & Engineering',
  'Data Science & Analytics',
  'Design & Creative',
  'Marketing & Communications',
  'Business & Management',
  'Healthcare & Medicine',
];

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
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Software Development & Engineering');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [jobRoles, setJobRoles] = useState([]);
  const [error, setError] = useState(null);

  const years = ['2023', '2024', '2025', '2026'];

  useEffect(() => {
    const fetchSkillScores = async () => {
      setIsLoading(true); // ← fix: this was setLoading before
      try {
        const response = await axios.get('http://localhost:8080/api/v1/skillScores');
        console.log('API Response:', response.data);
  
        const scores = response.data;
  
        if (scores && scores.length > 0) {
          // ✅ Avoid duplicate jobRoleNames
          const aggregatedData = scores.reduce((acc, curr) => {
            const exists = acc.find(item => item.subject === curr.jobRoleName);
            if (!exists) {
              acc.push({
                subject: curr.jobRoleName,              // job role name
                skillName: curr.skillName,              // just keeping one skill per job role
                score: (curr.predictedScore / curr.totalQuestions) * 100,
                predictedScore: curr.predictedScore,
                totalQuestions: curr.totalQuestions,
                learningPath: curr.learningPath,
                suggestion: curr.suggestion
              });
            }
            return acc;
          }, []);
  
          setJobRoles(aggregatedData);
          console.log('Processed Chart Data:', aggregatedData);
        } else {
          setError('No skill score data found');
        }
      } catch (error) {
        console.error('Error fetching skill scores:', error);
        setError('Failed to load skill scores. Please try again later.');
      } finally {
        setIsLoading(false); // ← fix: this was setLoading before
      }
    };
  
    fetchSkillScores();
  }, []);
  

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarSub />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="w-full">
            <div className="border-b-2 border-solid border-gray-300 mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Choose Your Career Path</h1>
              <p className="text-gray-500 text-sm">Select a role to begin your skill assessment journey</p>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center p-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="p-10 text-center text-red-500">
                {error}
                <button
                  className="block mx-auto mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4 justify-start items-start">
                {jobRoles.length > 0 ? (
                  jobRoles.map((role) => (
                    <div
                      key={role.subject}
                      onClick={() => navigate(`/result/${role.subject}`)}
                      className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{role.subject}</h3>
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center p-6">
                    <p className="text-gray-500">No job roles available. Please check back later.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
