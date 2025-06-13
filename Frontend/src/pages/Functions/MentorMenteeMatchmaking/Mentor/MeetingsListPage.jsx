// MeetingsListPage.jsx
import React, { useEffect, useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Mail, Video, Users, Edit3, Trash2, Play, Plus, Search, Filter } from 'lucide-react';
import axios from 'axios';
import SidebarSub from '../../../../component/template/SidebarSub';
import TopHeader from '../../../../component/template/TopHeader';
import Alert from '../../../../component/template/alert/Alert';

export default function MeetingsListPage() {
  const navigate = useNavigate();

  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [loading, setLoading] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleGetUserDetails = (e) => {
    console.log('This is the bedl', e);
    setUserDetails(e);
  };

  const showAlert = (text, type = 'success') => {
    setAlertMessage(text);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage('');
      setAlertType('');
    }, 3000);
  };

  // Fetch meetings data
  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/v2/matchmaking/meeting/${userDetails.user_id}`);
      console.log('This is the resposne ', response.data);
      setMeetings(response.data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userDetails) {
      fetchMeetings();
    }
  }, [userDetails]);

  // Determine meeting status
  const getMeetingStatus = (date, startTime, endTime) => {
    const now = new Date();
    const meetingStart = new Date(`${date}T${startTime}`);
    const meetingEnd = new Date(`${date}T${endTime}`);

    if (now < meetingStart) return 'Upcoming';
    if (now >= meetingStart && now <= meetingEnd) return 'Ongoing';
    return 'Completed';
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'Upcoming':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'Ongoing':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Completed':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Handle Join Meeting
  const handleJoinMeeting = async (meeting) => {
    try {
      showAlert('Joining meeting...', 'success');
      console.log('This is the data', data);
      navigate(`/join-meeting/${meeting.id}`);
    } catch (error) {
      showAlert('Failed to join meeting. Please try again.', 'error');
    }
  };

  // Handle Edit Meeting
  const handleEditMeeting = (meetingId) => {
    navigate(`/edit-meeting/${meetingId}`);
  };

  // Handle Delete Meeting
  const handleDeleteMeeting = async (meetingId) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        await axios.delete(`http://localhost:8080/api/v2/matchmaking/meeting/${meetingId}`);
        showAlert('Meeting deleted successfully!', 'success');
        fetchMeetings(); // Refresh the list
      } catch (error) {
        console.error('Error deleting meeting:', error);
        showAlert('Failed to delete meeting. Please try again.', 'error');
      }
    }
  };

  // Filter meetings based on search and status
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.mentor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.mentee.toLowerCase().includes(searchTerm.toLowerCase());

    const status = getMeetingStatus(meeting.date, meeting.start_time, meeting.end_time);
    const matchesStatus = statusFilter === 'all' || status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Format time to display
  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format date to display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      {alertMessage && <Alert message={alertMessage} type={alertType} />}
      <div className="flex h-screen overflow-hidden bg-white">
        <SidebarSub />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <TopHeader HeaderMessage={'Meetings'} handleGetUserDetails={handleGetUserDetails} />

          <div className="flex-1 flex m-5 flex-col pt-5 pl-10 overflow-auto">
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-semibold text-2xl text-gray-900 flex items-center">
                    <Video className="h-8 w-8 mr-2 text-blue-600" />
                    My Meetings
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">Manage your scheduled meetings and video calls</p>
                </div>
                <button
                  onClick={() => navigate('/create-meeting')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Meeting
                </button>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 w-2xl">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search meetings by title, mentor, or mentee..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Meetings Table */}
            <div className="mr-8">
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="ml-2 text-gray-600">Loading meetings...</span>
                  </div>
                ) : filteredMeetings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <Video className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No meetings found</h3>
                    <p className="text-sm text-gray-500">
                      {meetings.length === 0
                        ? 'Create your first meeting to get started'
                        : 'Try adjusting your search or filters'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Meeting Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Meeting Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Start Time and End Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Participant Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredMeetings.map((meeting) => {
                          const status = getMeetingStatus(meeting.date, meeting.start_time, meeting.end_time);
                          return (
                            <tr key={meeting.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div>
                                    <div className="text-sm text-gray-500">ID: {meeting.meeting_id}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center text-sm text-gray-900">
                                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                  <div>
                                    <div className="text-gray-600 text-sm truncate max-w-xs">
                                      {formatDate(meeting.date)}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center text-sm text-gray-900">
                                  <div>
                                    <div className="text-gray-500 flex items-center mt-1">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {formatTime(meeting.start_time)} - {formatTime(meeting.end_time)}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={getStatusBadge(status)}>{status}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Mail className="h-3 w-3 text-gray-400 mr-1" />
                                  <span className="text-gray-600 text-sm ml-1 truncate max-w-xs">{meeting.mentee}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleJoinMeeting(meeting)}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                    title="Join Meeting"
                                  >
                                    <Play className="h-3 w-3 mr-1" />
                                    Join
                                  </button>
                                  {userDetails.role == 'MENTOR' && (
                                    <>
                                      <button
                                        onClick={() => handleEditMeeting(meeting.id)}
                                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                        title="Edit Meeting"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDeleteMeeting(meeting.id)}
                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                        title="Delete Meeting"
                                      >
                                        Delete
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Meeting Count */}
              {!loading && filteredMeetings.length > 0 && (
                <div className="mt-4 text-sm text-gray-500">
                  Showing {filteredMeetings.length} of {meetings.length} meetings
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
