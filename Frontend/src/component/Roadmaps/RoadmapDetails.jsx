import axios from 'axios';
import React, { useState, useEffect } from 'react';

const RoadmapDetails = ({ handleEdit }) => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sampleData, setSampleData] = useState([]);
  const userDetails = JSON.parse(localStorage.getItem('user'));

  // Function to calculate progress percentage
  const calculateProgress = (progressObj) => {
    if (!progressObj || Object.keys(progressObj).length === 0) {
      return 0;
    }

    const totalSteps = Object.keys(progressObj).length;
    const completedSteps = Object.values(progressObj).filter((step) => step.status === 'COMPLETED').length;

    return Math.round((completedSteps / totalSteps) * 100);
  };

  // Function to get progress bar color based on percentage
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    if (percentage >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Function to get text color based on percentage
  const getTextColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    if (percentage >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  // Simulating data for demonstration
  useEffect(() => {
    // In a real application, you would use axios to fetch data
    // This is just for demonstration purposes
    const fetchData = async () => {
      setIsLoading(true);
      fetchRoadmapDetails();
    };
    // Simulate API call delay
    setTimeout(fetchData, 1000);
  }, []);

  const fetchRoadmapDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/roadmaps/user/${userDetails.user_id}`);
      const dataList = response.data; // Make sure the backend returns an array
      const mappedData = dataList.map((data) => ({
        r_Id: data.r_Id,
        job_name: data.job_name,
        progress: calculateProgress(data.progress), // Calculate progress percentage
      }));
      setSampleData(mappedData);
      setRoadmaps(mappedData);
      console.log('This is the progress', mappedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching roadmaps:', err);
      setError('Failed to load roadmaps. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/roadmaps/rid/${id}`);
      fetchRoadmapDetails();
    } catch (error) {
      window.alert('Network error. Failed to connect to network. Please check your internet connection');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 border border-red-200 rounded-lg bg-red-50 text-red-700">
        <h3 className="font-bold mb-2">Error</h3>
        <p>{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-5">Your Roadmaps</h2>

      {roadmaps.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-gray-600">No roadmaps found. Create a new roadmap to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Name
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {roadmaps.map((roadmap) => (
                <tr key={roadmap.r_Id} className="hover:bg-gray-50">
                  
                  <td className="py-4 px-6 text-sm text-gray-900">{roadmap.job_name}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-300 ${getProgressColor(
                              roadmap.progress
                            )}`}
                            style={{ width: `${roadmap.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold min-w-[3rem] ${getTextColor(roadmap.progress)}`}>
                        {roadmap.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(roadmap.r_Id)}
                        id="ViewRoadmap"
                        className="text-blue-600 hover:text-blue-900 px-3 py-1 bg-blue-100 rounded"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(roadmap.r_Id)}
                        id="DeleteRoadmap"
                        className="text-red-600 hover:text-red-900 px-3 py-1 bg-red-100 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RoadmapDetails;
