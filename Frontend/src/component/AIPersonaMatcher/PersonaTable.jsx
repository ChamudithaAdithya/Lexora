import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { X, Eye } from "lucide-react";

const MentorAIChat = ({ jobs }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hello! I'm Mentor AI. I can help match your skills and interests to potential career paths. What would you like to know about career guidance?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState('');
  const [currentPersona, setCurrentPersona] = useState('');
  const messagesEndRef = useRef(null);
  const chatSessionRef = useRef(null);
  const navigate = useNavigate();

  const userDetails = JSON.parse(localStorage.getItem('user'));
  const userId = userDetails?.user_id;

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const apiKey = "AIzaSyCQUQ9sYtjSjasfpps4bK00hUkqdMwSDV0";
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash-exp-image-generation",
          systemInstruction:
            "You are the career guidance AI. Your job is career persona matching. Respond with a table having 4 columns: No., Career Persona, Matching %, and Suggestions to Improve.importante",
        });

        chatSessionRef.current = model.startChat({
          generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 1024 },
          history: [],
        });
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initializeChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const parseTableResponse = (response) => {
    const rows = response.split("\n").filter(row => row.trim() !== "");
    if (rows.length < 3) return [];
    return rows.slice(2).map(row => {
      const cells = row.split("|").map(cell => cell.trim()).filter(cell => cell !== "");
      return {
        No: cells[0],
        CareerPersona: cells[1],
        MatchingPercentage: cells[2],
        Suggestions: cells[3],
      };
    });
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;
    const userMessage = { role: 'user', content: message.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      if (chatSessionRef.current) {
        const result = await chatSessionRef.current.sendMessage(message);
        const aiResponse = await result.response.text();
        const parsedTableData = parseTableResponse(aiResponse);
        setTableData(parsedTableData);
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (jobs) handleSendMessage(jobs);
  }, [jobs]);

  const sendDataToBackend = async () => {
    const formattedData = tableData
      .filter(row => row.CareerPersona != null)
      .map((row, index) => ({
        no: index,
        persona: row.CareerPersona,
        matchPrecentage: row.MatchingPercentage,
        suggestion: row.Suggestions,
      }));

    if (formattedData.length === 0) {
      alert("No data to save.");
      return;
    }

    try {
      // Delete existing personas for the user
      await axios.delete(`http://localhost:8080/api/v1/persona/user/${userId}`);

      // Save new personas
      await axios.post(`http://localhost:8080/api/v1/persona/user/${userId}`, formattedData, {
        headers: { 'Content-Type': 'application/json' },
      });

      alert('Data sent successfully!');
      navigate("/savedPersonas");
    } catch (error) {
      console.error('Error sending data:', error);
      alert('Failed to send data');
    }
  };

  const handleViewSuggestion = (suggestion, persona) => {
    setCurrentSuggestion(suggestion);
    setCurrentPersona(persona);
    setShowPopup(true);
  };

  return (
    <div className="container mx-auto px-4 py-4 relative">
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
            {tableData.length > 0 ? tableData
              .filter(row => row.CareerPersona !== "---" && parseFloat(row.MatchingPercentage) <= 1000)
              .map((row, index) => (
                <tr key={index} className={`hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.CareerPersona}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-800">{row.MatchingPercentage}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <button
                      onClick={() => handleViewSuggestion(row.Suggestions, row.CareerPersona)}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded flex items-center gap-1"
                    >
                      <Eye size={16} /> View
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-blue-800 font-medium">No career personas found.</td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-blue-800">{currentPersona} - Suggestions</h3>
              <button onClick={() => setShowPopup(false)} className="text-gray-500 hover:text-gray-700">
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

      <button
        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transition-colors"
        onClick={sendDataToBackend}
      >
        Save
      </button>
    </div>
  );
};

export default MentorAIChat;
