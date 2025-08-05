import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, TrendingUp, AlertCircle, Search, Filter } from 'lucide-react';
import axios from 'axios';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/TopHeader';

export default function TrendingJobsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Software Development & Engineering');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [searchTerm, setSearchTerm] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [jobRoles, setJobRoles] = useState([]);
  const [error, setError] = useState(null);

  const years = ['2023', '2024', '2025', '2026'];

  useEffect(() => {
    const fetchJobRoles = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/v1/jobRole');
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

  // Filter job roles based on search term
  const filteredJobRoles = jobRoles.filter((role) => role.jobRoleName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <SidebarSub />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <TopHeader HeaderMessage={'Skill Gap Analyzer'} />

        <div className="flex-1 flex m-5 flex-col pt-5 pl-10 overflow-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Choose Your Career Path</h1>
            <p className="text-gray-600 mt-2">Select a role to begin your skill assessment journey</p>
          </div>

          {/* Job Roles Section */}
          <div className="mr-8">
            <div className="bg-white overflow-hidden">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Loading job roles...</h3>
                  <p className="text-sm text-gray-500">Please wait while we fetch the available roles</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Error Loading Roles</h3>
                  <p className="text-sm text-gray-500 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredJobRoles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No roles found</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {searchTerm ? `No roles match "${searchTerm}"` : 'No job roles available at the moment'}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredJobRoles.map((role, index) => (
                    <div
                      key={role.jobRoleId}
                      onClick={() => navigate(`/skills/${role.jobRoleId}`)}
                      className="group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-300 hover:bg-blue-50"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <span className="text-sm font-medium text-blue-800">{index + 1}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-gray-500">Active</span>
                          </div>
                        </div>

                        <h4 className="text-md font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                          {role.jobRoleName}
                        </h4>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Skills: {role.skillLists?.length || 0}</span>
                          <span className="text-blue-600 group-hover:text-blue-700 font-medium">
                            Start Assessment →
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
