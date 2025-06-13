import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/TopHeader';

export default function TrendingJobsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Software Development & Engineering');
  const [selectedYear, setSelectedYear] = useState('2025');

  const [isLoading, setIsLoading] = useState(true);
  const [jobRoles, setJobRoles] = useState([]);
  const [error, setError] = useState(null);

  const years = ['2023', '2024', '2025', '2026'];

  useEffect(() => {
    const fetchJobRoles = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/v1/jobRole'); // Adjust if different port
        setJobRoles(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching job roles:', err);
        setError('Failed to load job roles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobRoles();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarSub />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader HeaderMessage={'Skill Gap Analyzer'} />

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
                      key={role.jobRoleId}
                      onClick={() => navigate(`/skills/${role.jobRoleId}`)}
                      className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{role.jobRoleName}</h3>
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
