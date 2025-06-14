import axios from 'axios';
import React, { useState, useEffect } from 'react';
import SidebarSub from '../../component/template/SidebarSub';
import TopHeader from '../../component/template/TopHeader';
import { Eye } from 'lucide-react';

const ViewAllFeedbacks = ({handleEdit}) => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sampleData, setSampleData] = useState([]);
  const userDetails = JSON.parse(localStorage.getItem("user"));

  // Star Rating Display Component
  const StarRating = ({ rating }) => {
    const numericRating = parseInt(rating) || 0;
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= numericRating
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
        
      </div>
    );
  };

  const fetchRoadmapDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/feedback/getAll`);
      
      // Use response.data instead of undefined dataList
      const dataList = response.data;
      
      const mappedData = dataList.map(data => ({
        id: data.id || data.f_Id, // Add an id field for the key
        name: data.name,
        email: data.email,
        category: data.category,
        rating: data.rating,
        subject: data.subject,
        feedback: data.feedback,
      }));
      
      setSampleData(mappedData);
      setRoadmaps(mappedData);
      console.log("This is the feedback data:", mappedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError('Failed to load feedbacks. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add useEffect to call the function
  useEffect(() => {
    fetchRoadmapDetails();
  }, []);

  // Add loading and error states
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-8">
          <p className="text-gray-600">Loading feedbacks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-8">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchRoadmapDetails}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex overflow-hidden ">
          <SidebarSub />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopHeader HeaderMessage={' Feedback Details'} />
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-5">User Feedbacks</h2>
      
      {roadmaps.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-gray-600">No feedback found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Name
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {roadmaps.map((feedback) => (
                <tr key={feedback.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm text-gray-900">{feedback.name}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{feedback.email}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{feedback.category}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    <StarRating rating={feedback.rating} />
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">{feedback.subject}</td>
                  <td className="py-4 px-6 text-sm font-medium text-center">
                    <div className="flex justify-center space-x-2">
                      <button 
                        onClick={() => handleEdit(feedback.id)}
                        id='ViewFeedback'
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        title= "View Feedback"
                      >
                        <Eye className="h-3 w-3 mr-1" />

                        View
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
    </div>
    </div>
  );
  
};

export default ViewAllFeedbacks;