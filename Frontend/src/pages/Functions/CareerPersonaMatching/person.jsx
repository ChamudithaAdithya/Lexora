import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/TopHeader';
import { Eye, X } from "lucide-react";

export default function MatchedPersona() {
  const [tableData, setTableData] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState('');
  const [currentPersona, setCurrentPersona] = useState('');
  const userDetails = JSON.parse(localStorage.getItem('user'));

// Get the user_id
const userId = userDetails?.user_id;

  const navigate = useNavigate();
  const handleNavigate = () => { navigate("/Persona") };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/persona/user/${userId}`);
        console.log('API Response:', response.data); // Log to see the actual structure
        setTableData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please check your backend.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const deletePersonas = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/persona/user/${userId}`, {
        headers: { 'Content-Type': 'application/json' }
      });

      alert('Data deleted successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('Failed to delete data: ' + (error.response?.data || error.message));
    }
  };

  const handleViewSuggestion = (suggestion, persona) => {
    setCurrentSuggestion(suggestion);
    setCurrentPersona(persona);
    setShowPopup(true);
  };

  return (
    <div className="flex overflow-hidden">
      <SidebarSub />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader HeaderMessage={'Matched Career Persona'} />
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="container mx-auto px-4 py-4">
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-blue-100">
              <table className="min-w-full divide-y divide-blue-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">No.</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Career Persona</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Matching %</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Suggestions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-blue-800 font-medium">Loading...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-red-500 font-medium">{error}</td>
                    </tr>
                  ) : tableData.length > 0 ? (
                    tableData
                      .filter(row => row.persona !== "---" && row.persona !== null)
                      .map((row, index) => (
                        <tr key={index} className={`hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}`}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">{index + 1}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{row.persona}</td>
                          <td className="px-6 py-4 text-sm font-medium text-blue-800">{row.matchPrecentage}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <button
                              onClick={() => handleViewSuggestion(row.suggestion, row.persona)}
                              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded flex items-center gap-1"
                            >
                              <Eye size={16} /> View
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-blue-800 font-medium">No career personas found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Popup for suggestions */}
            {showPopup && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-blue-800">{currentPersona} - Suggestions</h3>
                    <button 
                      onClick={() => setShowPopup(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="prose prose-blue">
                    <p className="text-gray-700 whitespace-pre-line">{currentSuggestion}</p>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setShowPopup(false)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
              <p>{userId}</p>
            <div className="flex space-x-4 mt-4">
              <button 
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium shadow-md transition-colors"
                onClick={handleNavigate}
              >
                Update
              </button>
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transition-colors"
                onClick={deletePersonas}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}