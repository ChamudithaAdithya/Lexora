// CreateMeetingPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, Mail, Video, Users, Send, User, CalendarDays } from 'lucide-react';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/TopHeader';
import Alert from '../../../component/template/alert/Alert';
import axios from 'axios';

export default function CreateMeetingPage({ TopHeadertitle }) {
  const navigate = useNavigate();

  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const { meetingId } = useParams();

  const handleGetUserDetails = (e) => {
    setUserDetails(e.user_id);
    setData((prev) => ({
      ...prev,
      mentor: e.email,
    }));
  };

  const [data, setData] = useState({
    title: 'Career Guidance',
    date: '',
    start_time: '',
    end_time: '',
    mentor: '',
    mentee: '',
  });

  useEffect(() => {
    const fetchMeeting = async () => {
      if (meetingId) {
        try {
          const response = await axios.get(`http://localhost:8080/api/v2/matchmaking/meeting/meetingId/${meetingId}`);
          console.log('Data is fetched', response.data);
          setData(response.data);
        } catch (error) {
          console.error('Failed to fetch meeting:', error);
        }
      }
    };
    fetchMeeting();
  }, [meetingId]);

  const showAlert = (text, type = 'success') => {
    setAlertMessage(text);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage('');
      setAlertType('');
    }, 3000);
  };

  const handleChange = (e) => setData((d) => ({ ...d, [e.target.name]: e.target.value }));

  const genId = () => Math.random().toString(36).substr(2, 9).toUpperCase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, date, start_time, end_time, mentor, mentee } = data;

    // Validation
    if (!title.trim()) {
      showAlert('Meeting title is required', 'error');
      return;
    }

    if (!date || !start_time || !end_time) {
      showAlert('Please fill in all date and time fields', 'error');
      return;
    }

    if (new Date(`${date}T${start_time}`) >= new Date(`${date}T${end_time}`)) {
      showAlert('end_time time must be after start_time time', 'error');
      return;
    }

    if (new Date(`${date}T${start_time}`) <= new Date()) {
      showAlert('Meeting must be scheduled for future date and time', 'error');
      return;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(mentor) || !emailRe.test(mentee)) {
      showAlert('Please enter valid email addresses', 'error');
      return;
    }

    if (mentor === mentee) {
      showAlert('mentor and mentee emails must be different', 'error');
      return;
    }

    try {
      setLoading(true);
      const meeting_id = genId();
      const meet = { meeting_id, ...data };
      console.log('This is that meeting that is created', meet);
      if (TopHeadertitle != undefined || TopHeadertitle != null) {
        const response = axios.put(`http://localhost:8080/api/v2/matchmaking/meeting/${meet.id}`, meet);
        showAlert('Meeting Updated successfully! Redirecting...', 'success');
        console.log('This Is the meeting: ', meet);
      } else {
        const response = axios.post(`http://localhost:8080/api/v2/matchmaking/meeting/${userDetails}`, meet);
        showAlert('Meeting created successfully! Redirecting...', 'success');
      }
      setTimeout(() => {
        navigate('/meetingsList');
      }, 3000);
    } catch (error) {
      showAlert('Failed to create meeting. Please try again.', 'error');
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
          <TopHeader
            HeaderMessage={TopHeadertitle ? TopHeadertitle : 'Create Video Meeting'}
            handleGetUserDetails={handleGetUserDetails}
          />

          <div className="flex-1 flex m-5 flex-col pt-5 pl-10 overflow-auto">
            {/* Page Header */}
            <div className="mb-3">
              <h1 className="font-semibold text-2xl text-gray-900 flex items-center">
                <Video className="h-8 w-8 mr-2 text-blue-600" />
                Meeting Details
              </h1>
              <div className="mb-6 mt-4">
                <p className="text-sm text-gray-600 mt-1">Fill in the meeting information and participant details</p>
              </div>
            </div>

            {/* Meeting Creation Form */}

            <div className="mr-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Meeting Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Title *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      name="title"
                      type="text"
                      placeholder="Enter meeting title"
                      value={data.title}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Date and Time Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Date *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        name="date"
                        type="date"
                        value={data.date}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">start_time Time *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        name="start_time"
                        type="time"
                        value={data.start_time}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">end_time Time *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        name="end_time"
                        type="time"
                        value={data.end_time}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Participant Information */}
                <div className=" mt-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Participant Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Email Address *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          name="mentor"
                          type="email"
                          placeholder="your.email@example.com"
                          value={data.mentor}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">mentee Email Address *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          name="mentee"
                          type="email"
                          placeholder="mentee.email@example.com"
                          value={data.mentee}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end_time space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Cancel
                  </button>
                  {TopHeadertitle ? (
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Update Meeting
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Create Meeting
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
