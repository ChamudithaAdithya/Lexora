// RequestSessionPage.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, MessageSquare, User, Send, BookOpen, Users, TvIcon } from 'lucide-react';
import axios from 'axios';
import SidebarSub from '../../../../component/template/SidebarSub';
import TopHeader from '../../../../component/template/TopHeader';
import Alert from '../../../../component/template/alert/Alert';

export default function RequestSessionPage() {
  const navigate = useNavigate();
  const { user_id, mentor_id } = useParams();

  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState('');

  const [data, setData] = useState({
    mentorMessage: '',
    menteeMessage: '',
    requested_time: '',
    mentor_user_id: '',
    mentee_email: '',
  });

  const handleGetUserDetails = (user) => {
    setUserDetails(user);
  };

  const showAlert = (text, type = 'success') => {
    setAlertMessage(text);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage('');
      setAlertType('');
    }, 3000);
  };

  // Function to send notification to the Mentor. This function can be called after a session request is successfully sent.
  const sendNotificationToUser = async (user_id, notification, message) => {
    try {
      const notificationData = {
        reciever: { user_id: user_id },
        notification: notification,
        message: message,
      };
      await axios.post('http://www.localhost:8080/api/v2/notification', notificationData);
      console.log('Notification sent successfully', notificationData);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleChange = (e) => setData((d) => ({ ...d, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { mentorMessage, menteeMessage, requested_time } = data;
    console.log('Ddata', data);

    // Validation

    if (!menteeMessage.trim()) {
      showAlert('Your message is required', 'error');
      return;
    }

    if (!requested_time) {
      showAlert('Please select a requested session time', 'error');
      return;
    }

    if (new Date(requested_time) <= new Date()) {
      showAlert('Session must be requested for future date and time', 'error');
      return;
    }

    try {
      setLoading(true);
      const sessionRequest = {
        mentor_message: mentorMessage.trim(),
        mentee_message: menteeMessage.trim(),
        requested_time: requested_time,
        status: 'PENDING',
        mentor: {
          user_id: parseInt(mentor_id),
        },
        user_id: parseInt(user_id),
        mentee_email: userDetails.email,
      };

      console.log('Session request data:', sessionRequest);

      const response = await axios.post('http://localhost:8080/api/v2/matchmaking/requestSession', sessionRequest);

      showAlert('Session request sent successfully! Redirecting...', 'success');
      sendNotificationToUser(
        mentor_id,
        'MENTOR_SESSION_REQUEST',
        `You have a new session request from user ID: ${user_id}`
      );
      console.log('Session request response:', response.data);

      setTimeout(() => {
        navigate(`/RequestedSessionsPage/${user_id}/0`); // Adjust route as needed
      }, 3000);
    } catch (error) {
      console.error('Failed to send session request:', error);
      showAlert('Failed to send session request. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {alertMessage && <Alert message={alertMessage} type={alertType} />}
      <div className="flex h-screen overflow-hidden bg-white">
        <SidebarSub />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <TopHeader HeaderMessage="Request Mentoring Session" handleGetUserDetails={handleGetUserDetails} />

          <div className="flex-1 flex m-5 flex-col pt-5 pl-10 overflow-auto">
            {/* Page Header */}
            <div className="mb-3">
              <h1 className="font-semibold text-2xl text-gray-900 flex items-center">
                <TvIcon className="h-8 w-8 mr-2 text-blue-600" />
                Request Session
              </h1>
              <div className="mb-6 mt-4">
                <p className="text-sm text-gray-600 mt-1">
                  Send a session request to your mentor with your preferred time and message
                </p>
              </div>
            </div>

            {/* Session Request Form */}
            <div className="mr-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Requested Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Session Time *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      name="requested_time"
                      type="datetime-local"
                      value={data.requested_time}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Give a good time for the mentor to prepare for the session. The mentor will confirm the time.
                  </p>
                </div>

                {/* Messages Section */}
                <div className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Introduction Message *
                      </label>
                      <div className="relative">
                        <textarea
                          name="menteeMessage"
                          rows="4"
                          placeholder="Introduce yourself and explain why you're seeking mentorship ..."
                          value={data.menteeMessage}
                          onChange={handleChange}
                          className="block w-full pl-5 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
                          required
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        You can share your other available times, so that the mentor can arrange a meeting accordingly.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 ">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex cursor-pointer items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Sending Request...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
