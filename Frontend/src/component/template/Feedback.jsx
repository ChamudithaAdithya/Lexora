import React, { useEffect, useState } from 'react';
import userProfileHandleService from '../../services/userProfileHandleService';
import axios from 'axios';

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    rating: '',
    subject: '',
    feedback: ''
  });

  // Start Get User Details 
  const [profileDetails, setProfileDetails] = useState('');

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.user_id && user.token) {
        userProfileHandleService.findUserProfileById(user.user_id).then((response) => {
          setProfileDetails(response.data);
        });
      }
    }, []);

  // End Get User Details

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    setFormData(prev=> ({...prev, name: profileDetails.f_name+ " "+profileDetails.l_name, email: profileDetails.email, rating: formData.rating || '0' }));
  };

  const [hoveredStar, setHoveredStar] = useState(0);

  const handleStarClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating: rating.toString()
    }));
  };

  const handleStarHover = (rating) => {
    setHoveredStar(rating);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      

      // Send data to backend using fetch
      const response = await axios.post('http://localhost:8080/api/feedback/saveFeedback',formData);
      
      if (response.ok) {
        // Success handling - handle different response types
        let responseData;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }
        
        console.log('Feedback submitted successfully:', responseData);
        alert('Thank you for your feedback! We appreciate your input.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          category: '',
          rating: '',
          subject: '',
          feedback: ''
        });
      } else {
        // Handle HTTP error status
        let errorMessage;
        try {
  if (response.status === 200 || response.status === 201) {
    // Success case
    alert("The feedback successfully added");
    window.location.reload();

    return; // Exit early on success
  }
  // Handle error responses
  const errorData = await response.json();
  errorMessage = errorData.message || `HTTP error! status: ${response.status}`&& response.status !== 200 && response.status !== 201 ? errorData.message : `HTTP error! status: ${response.status}`;
} catch {
  errorMessage = `HTTP error! status: ${response.status}`;
}
        throw new Error(errorMessage);
      }
    } catch (error) {
      // Error handling
      console.error('Error submitting feedback:', error);
      alert(`Error: ${error.message || 'Failed to submit feedback. Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="px-6 py-5 sm:p-5">
        <h3 className="text-2xl text-gray-900 font-medium mb-2">Share Your Experience </h3>

        <div className="mt-14">
          {/* Feedback Category */}
          <div className="flex mb-6 object-center">
            <div className="w-35 mr-5">
              <label htmlFor="category" className="text-base font-medium text-gray-900">
                Feedback Category
              </label>
            </div>
            <div className="flex-1">
              <select
                name="category"
                id="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm  focus:outline-none focus:border-blue-600 caret-blue-600"
                required
              >
                <option value="">Select a category</option>
                <option value="roadmap">Roadmap Generator</option>
                <option value="industry">Industry Insights</option>
                <option value="Analyzer">Skill Gap Analyzer</option>
                <option value="persona">Persona Matcher</option>
                <option value="others">Others</option>
              </select>
            </div>
          </div>

          {/* Overall Rating */}
          <div className="flex mb-6 object-center">
            <div className="w-35 mr-5">
              <label className="text-base font-medium text-gray-900">
                Overall Rating
              </label>
            </div>
            <div >
              <div className="flex items-center ">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                    className="text-3xl transition-colors duration-200 focus:outline-none w-full rounded-md  px-3 "
                  >
                    <span 
                      className={`${
                        star <= (hoveredStar || parseInt(formData.rating) || 0)
                          ? 'text-yellow-400' 
                          : 'text-gray-300'
                      } hover:text-yellow-400`}
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
              
            </div>
          </div>

          {/* Subject */}
          <div className="flex mb-6 object-center">
            <div className="w-35 mr-5">
              <label htmlFor="subject" className="text-base font-medium text-gray-900">
                Subject
              </label>
            </div>
            <div className="flex-1">
              <input
                type="text"
                name="subject"
                id="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Brief summary of your feedback"
                required
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm  focus:outline-none focus:border-blue-600 caret-blue-600"
              />
            </div>
          </div>

          {/* Feedback Section */}
          <div className="flex mb-6 object-center">
            <div className="w-35 mr-5">
              <label htmlFor="feedback" className="text-base font-medium text-gray-900 ">
                Your Feedback
              </label>
            </div>
            <div className="flex-1">
              <textarea
                name="feedback"
                id="feedback"
                value={formData.feedback}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm  focus:outline-none focus:border-blue-600 caret-blue-600"
                rows="6"
                required
              />
            </div>
          </div>
          
          <div className="sm:col-span-2">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-700 cursor-pointer'
              } text-white px-4 py-2 rounded-md text-sm font-medium`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}