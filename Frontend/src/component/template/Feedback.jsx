import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronDown,
  Filter,
  Star,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  User,
  SortAsc,
} from 'lucide-react';
import NotificationsPanel from './NotificationsPanel';

const initialFeedbacks = [
  {
    id: 1,
    name: 'Emily Johnson',
    date: '2025-03-15',
    mood: 4,
    comment: 'Exceptional service! The new features have significantly improved my workflow.',
    department: 'Product Management',
    likes: 12,
    replies: 3,
  },
  {
    id: 2,
    name: 'Alex Rodriguez',
    date: '2025-03-14',
    mood: 2,
    comment: 'Experienced some performance issues with the latest update.',
    department: 'Engineering',
    likes: 5,
    replies: 2,
  },
  {
    id: 3,
    name: 'Sarah Kim',
    date: '2025-03-13',
    mood: 3,
    comment: 'Neutral experience. Some good points, some areas for improvement.',
    department: 'Customer Success',
    likes: 8,
    replies: 1,
  },
  {
    id: 4,
    name: 'Michael Chen',
    date: '2025-03-12',
    mood: 5,
    comment: 'Absolutely love the new interface! Very intuitive and user-friendly.',
    department: 'Design',
    likes: 15,
    replies: 4,
  },
  {
    id: 5,
    name: 'Rachel Green',
    date: '2025-03-11',
    mood: 1,
    comment: 'Frustrated with the current system. Needs major improvements.',
    department: 'Sales',
    likes: 3,
    replies: 2,
  },
  {
    id: 6,
    name: 'David Kumar',
    date: '2025-03-10',
    mood: 4,
    comment: "Great progress! Appreciate the team's continuous efforts.",
    department: 'Marketing',
    likes: 10,
    replies: 3,
  },
];

const Feedback = () => {
  const [selectedMood, setSelectedMood] = useState(2);
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const [newFeedback, setNewFeedback] = useState('');
  const [sortCriteria, setSortCriteria] = useState('date');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const moods = [
    { emoji: '😖', label: 'Very Unhappy', color: 'text-red-500' },
    { emoji: '😕', label: 'Unhappy', color: 'text-orange-500' },
    { emoji: '😐', label: 'Neutral', color: 'text-gray-500' },
    { emoji: '🙂', label: 'Happy', color: 'text-green-500' },
    { emoji: '😄', label: 'Very Happy', color: 'text-emerald-600' },
  ];

  const departments = ['All', 'Engineering', 'Product Management', 'Design', 'Marketing', 'Sales', 'Customer Success'];

  const submitFeedback = () => {
    if (newFeedback.trim()) {
      const newEntry = {
        id: feedbacks.length + 1,
        name: 'Current User',
        date: new Date().toISOString().split('T')[0],
        mood: selectedMood,
        comment: newFeedback,
        department: 'Unknown',
        likes: 0,
        replies: 0,
      };
      setFeedbacks([newEntry, ...feedbacks]);
      setNewFeedback('');
    }
  };

  const sortedFeedbacks = React.useMemo(() => {
    let filtered = filterDepartment === 'All' ? feedbacks : feedbacks.filter((f) => f.department === filterDepartment);

    return filtered.sort((a, b) => {
      switch (sortCriteria) {
        case 'likes':
          return b.likes - a.likes;
        case 'mood':
          return b.mood - a.mood;
        case 'replies':
          return b.replies - a.replies;
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });
  }, [feedbacks, sortCriteria, filterDepartment]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-4xl mx-auto">
      {/* Feedback Input Section */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <MessageCircle className="mr-3 text-blue-600" size={24} />
          Feedback & Insights
        </h2>

        <div className="flex space-x-4">
          <div className="flex space-x-2 items-center">
            {moods.map((mood, index) => (
              <button
                key={mood.label}
                onClick={() => setSelectedMood(index)}
                className={`text-3xl transition-all duration-200 transform 
                  ${
                    selectedMood === index
                      ? `scale-125 ${mood.color} border-2 border-blue-300 rounded-full p-1`
                      : 'opacity-50 hover:opacity-80'
                  }`}
                title={mood.label}
              >
                {mood.emoji}
              </button>
            ))}
          </div>

          <textarea
            value={newFeedback}
            onChange={(e) => setNewFeedback(e.target.value)}
            placeholder="Share your thoughts and suggestions..."
            className="flex-1 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            rows={3}
          />

          <button
            onClick={submitFeedback}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Feedback List Controls */}
      <div className="px-6 py-4 bg-gray-50 flex justify-between items-center border-b border-gray-200">
        <div className="flex space-x-3">
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
            >
              <Filter size={16} className="mr-2" />
              Department: {filterDepartment}
              <ChevronDown size={16} className="ml-2" />
            </button>
            {showFilterDropdown && (
              <div className="absolute z-10 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => {
                      setFilterDepartment(dept);
                      setShowFilterDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    {dept}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2">
            <SortAsc size={16} className="mr-2" />
            <select
              value={sortCriteria}
              onChange={(e) => setSortCriteria(e.target.value)}
              className="text-sm bg-transparent focus:outline-none"
            >
              <option value="date">Recent</option>
              <option value="likes">Most Liked</option>
              <option value="mood">Mood Rating</option>
              <option value="replies">Most Discussed</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-500">{sortedFeedbacks.length} Feedback Entries</div>
      </div>

      {/* Feedback List */}
      <div className="divide-y divide-gray-100">
        {sortedFeedbacks.map((feedback) => (
          <div key={feedback.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-800">{feedback.name}</h3>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {feedback.date}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <User size={12} className="mr-1" />
                      {feedback.department}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{feedback.comment}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-gray-500">
                <button className="flex items-center hover:text-blue-600 transition-colors">
                  <ThumbsUp size={16} className="mr-1" />
                  {feedback.likes}
                </button>
                <button className="flex items-center hover:text-red-600 transition-colors">
                  <ThumbsDown size={16} className="mr-1" />
                </button>
                <button className="flex items-center hover:text-green-600 transition-colors">
                  <MessageCircle size={16} className="mr-1" />
                  {feedback.replies}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <NotificationsPanel />    
    </div>
  );
};

export default Feedback;
