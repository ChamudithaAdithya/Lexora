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
  
  // Edit state management
  const [editingJobId, setEditingJobId] = useState(null);
  const [editedJobName, setEditedJobName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const token = localStorage.getItem('token');
  const years = ['2023', '2024', '2025', '2026'];

  useEffect(() => {
    const fetchJobRoles = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/v1/jobRole', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
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
  }, [token]);

  // Handle edit button click
  const handleEditClick = (jobRole, event) => {
    event.stopPropagation(); // Prevent navigation
    setEditingJobId(jobRole.jobRoleId);
    setEditedJobName(jobRole.jobRoleName);
  };

  // Handle cancel edit
  const handleCancelEdit = (event) => {
    event.stopPropagation();
    setEditingJobId(null);
    setEditedJobName('');
  };

  // Handle save edit
  const handleSaveEdit = async (jobRole, event) => {
    event.stopPropagation();
    
    if (!editedJobName.trim()) {
      alert('Job role name cannot be empty');
      return;
    }

    if (editedJobName.trim() === jobRole.jobRoleName) {
      // No changes made
      setEditingJobId(null);
      setEditedJobName('');
      return;
    }

    setIsUpdating(true);

    try {
      // Prepare the data structure for update
      const updatedJobRoleData = {
        jobRoleId: jobRole.jobRoleId,
        jobRoleName: editedJobName.trim(),
        skillLists: jobRole.skillLists || []
      };

      const response = await axios.post(
  `http://localhost:8080/api/v1/jobRole`, // ✅ No ID in URL
  [updatedJobRoleData],                   // ✅ Wrap in array
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
);


      // Update the local state
      setJobRoles(jobRoles.map(role => 
        role.jobRoleId === jobRole.jobRoleId 
          ? { ...role, jobRoleName: editedJobName.trim() }
          : role
      ));

      setEditingJobId(null);
      setEditedJobName('');
      alert('Job role name updated successfully!');

    } catch (error) {
      console.error('Error updating job role:', error);
      if (error.response) {
        alert(`Error ${error.response.status}: ${error.response.data.message || 'Failed to update job role'}`);
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete job role
  const handleDeleteJobRole = async (jobRole, event) => {
    event.stopPropagation();
    
    if (!window.confirm(`Are you sure you want to delete "${jobRole.jobRoleName}"? This action cannot be undone.`)) {
      return;
    }

    setIsUpdating(true);

    try {
      await axios.delete(`http://localhost:8080/api/v1/jobRole/${jobRole.jobRoleId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Remove from local state
      setJobRoles(jobRoles.filter(role => role.jobRoleId !== jobRole.jobRoleId));
      alert('Job role deleted successfully!');

    } catch (error) {
      console.error('Error deleting job role:', error);
      if (error.response) {
        alert(`Error ${error.response.status}: ${error.response.data.message || 'Failed to delete job role'}`);
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarSub />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader HeaderMessage={'Skill Gap Analyzer'} />

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="w-full">
            <div className="border-b-2 border-solid border-gray-300 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Choose Your Career Path</h1>
                  <p className="text-gray-500 text-sm">Select a role to begin your skill assessment journey</p>
                </div>
                <button
                  onClick={() => navigate('/job-role/add')}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Add New Job Role
                </button>
              </div>
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
                      className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative group"
                    >
                      {/* Main content area - clickable for navigation */}
                      <div
                        onClick={() => navigate(`/sk10/${role.jobRoleId}`)}
                        className="p-6 cursor-pointer"
                      >
                        {editingJobId === role.jobRoleId ? (
                          // Edit mode
                          <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editedJobName}
                              onChange={(e) => setEditedJobName(e.target.value)}
                              className="w-full text-lg font-semibold text-gray-800 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                              disabled={isUpdating}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => handleSaveEdit(role, e)}
                                disabled={isUpdating}
                                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 disabled:bg-gray-400"
                              >
                                {isUpdating ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={isUpdating}
                                className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 disabled:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Display mode
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {role.jobRoleName}
                          </h3>
                        )}
                      </div>

                      {/* Action buttons - only show when not editing */}
                      {editingJobId !== role.jobRoleId && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                          <button
                            onClick={(e) => handleEditClick(role, e)}
                            className="bg-blue-500 text-white p-1 rounded text-xs hover:bg-blue-600"
                            title="Edit job role name"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => navigate(`/job-role/edit/${role.jobRoleId}`, { preventDefault: true })}
                            className="bg-purple-500 text-white p-1 rounded text-xs hover:bg-purple-600"
                            title="Edit full job role"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => handleDeleteJobRole(role, e)}
                            className="bg-red-500 text-white p-1 rounded text-xs hover:bg-red-600"
                            title="Delete job role"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
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