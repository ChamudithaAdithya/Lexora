// MeetingsListPage.jsx
import React, { useEffect, useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Mail, Video, Play, Plus, Search, Filter, Newspaper, ArrowRightCircle, X } from 'lucide-react';
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
  const [role, setRole] = useState('');

  // Feedback popup states
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [feedbackData, setFeedbackData] = useState({
    feedback: '',
    rating: '',
    mentor_id: null,
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

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

  // Fetch meetings data
  const fetchMeetings = async () => {
    try {
      setLoading(true);
      console.log('id :', userDetails);
      if (userDetails.role == 'MENTOR') {
        const response = await axios.get(`http://localhost:8080/api/v2/matchmaking/meeting/${userDetails.user_id}`);
        setMeetings(response.data);
      } else {
        const response = await axios.get(
          `http://localhost:8080/api/v2/matchmaking/meeting/mentee/${userDetails.user_id}`
        );
        setMeetings(response.data);
      }
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

  // Feedback popup functions
  const feedbackPopupOpen = (e, meetingId) => {
    e.preventDefault();
    const meeting = meetings.find((m) => m.id === meetingId);
    if (meeting) {
      setSelectedMeeting(meeting);
      setFeedbackData({
        feedback: '',
        rating: '',
        mentor_id: meeting.mentor_id || null,
      });
      setShowFeedbackPopup(true);
    }
  };

  const closeFeedbackPopup = () => {
    setShowFeedbackPopup(false);
    setSelectedMeeting(null);
    setFeedbackData({
      feedback: '',
      rating: '',
      mentor_id: null,
    });
    setHoveredStar(0);
  };

  const handleFeedbackInputChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStarClick = (rating) => {
    setFeedbackData((prev) => ({
      ...prev,
      rating: rating,
    }));
  };

  const handleStarHover = (rating) => {
    setHoveredStar(rating);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const handleFeedbackSubmit = async (e, meeting_id) => {
    e.preventDefault();
    if (!feedbackData.feedback.trim() || !feedbackData.rating) {
      showAlert('Please provide both feedback and rating', 'error');
      return;
    }

    try {
      setSubmittingFeedback(true);
      const feedbackPayload = {
        feedback: feedbackData.feedback,
        feedback_date_time: new Date().toISOString(),
        rating: parseFloat(feedbackData.rating),
        user: {
          user_id: userDetails.user_id,
        },
        mentor_id: feedbackData.mentor_id,
      };

      await axios.post('http://localhost:8080/api/v2/mentorFeedbacks', feedbackPayload);
      showAlert('Thank you for your feedback! We appreciate your input.', 'success');

      // Send email notification to mentor
      try {
        await axios.put(`http://localhost:8080/api/v2/matchmaking/meeting/${meeting_id}`);
        console.log('Notification has sent successfullyJJD');
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
      }

      closeFeedbackPopup();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showAlert('Failed to submit feedback. Please try again.', 'error');
    } finally {
      setSubmittingFeedback(false);
    }
  };

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
      case 'COMPLETED':
        return `${baseClasses} bg-green-600 text-white`;
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
      meeting.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.mentor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.mentee?.toLowerCase().includes(searchTerm.toLowerCase());

    const status = getMeetingStatus(meeting.date, meeting.start_time, meeting.end_time);
    const matchesStatus = statusFilter === 'all' || status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Get meeting counts for each status
  const getMeetingCounts = () => {
    const counts = {
      all: meetings.length,
      upcoming: 0,
      ongoing: 0,
      completed: 0,
    };

    meetings.forEach((meeting) => {
      const status = getMeetingStatus(meeting.date, meeting.start_time, meeting.end_time);
      counts[status.toLowerCase()]++;
    });

    return counts;
  };

  const meetingCounts = getMeetingCounts();

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
            {/* Filter Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {[
                  { key: 'all', label: `All Meetings (${meetingCounts.all})` },
                  { key: 'upcoming', label: `Upcoming (${meetingCounts.upcoming})` },
                  { key: 'ongoing', label: `Ongoing (${meetingCounts.ongoing})` },
                  { key: 'completed', label: `Completed (${meetingCounts.completed})` },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    className={`py-4 px-1 font-medium text-sm ${
                      statusFilter === key
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setStatusFilter(key)}
                  >
                    {label}
                  </button>
                ))}
              </nav>
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
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No meetings found</h3>
                    <p className="text-sm text-gray-500">
                      {meetings.length === 0
                        ? 'Create your first meeting to get started'
                        : `No ${statusFilter === 'all' ? '' : statusFilter} meetings match your search criteria`}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Meeting ID
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
                          {userDetails.role == 'MENTOR' ? (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Participant Email
                            </th>
                          ) : (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Mentor Email
                            </th>
                          )}
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredMeetings.map((meeting) => {
                          console.log('This is the meeting', meeting);
                          const status = getMeetingStatus(meeting.date, meeting.start_time, meeting.end_time);
                          return (
                            <tr key={meeting.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div>
                                    <div className="text-sm text-gray-500">{meeting.meeting_id}</div>
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
                              {meeting.status == 'COMPLETED' ? (
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={getStatusBadge(meeting.status)}>{meeting.status}</span>
                                </td>
                              ) : (
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={getStatusBadge(status)}>{status}</span>
                                </td>
                              )}

                              {userDetails.role == 'MENTOR' && (
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <Mail className="h-3 w-3 text-gray-400 mr-1" />
                                    <span className="text-gray-600 text-sm ml-1 truncate max-w-xs">
                                      {meeting.mentee}
                                    </span>
                                  </div>
                                </td>
                              )}
                              {userDetails.role == 'STUDENT' && (
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <Mail className="h-3 w-3 text-gray-400 mr-1" />
                                    <span className="text-gray-600 text-sm ml-1 truncate max-w-xs">
                                      {meeting.mentor}
                                    </span>
                                  </div>
                                </td>
                              )}

                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  {userDetails.role == 'STUDENT' && (
                                    <>
                                      {meeting.status != 'COMPLETED' && (
                                        <button
                                          onClick={() => handleJoinMeeting(meeting)}
                                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                          title="Join Meeting"
                                        >
                                          <Play className="h-3 w-3 mr-1" />
                                          Join
                                        </button>
                                      )}
                                      {(status === 'Completed' || meeting.status == 'COMPLETED') && (
                                        <>
                                          <button
                                            onClick={(e) => feedbackPopupOpen(e, meeting.id)}
                                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                            title="Give Feedback"
                                          >
                                            <ArrowRightCircle className="h-3 w-3 mr-1" />
                                            Give Feedback
                                          </button>
                                        </>
                                      )}
                                    </>
                                  )}
                                  {userDetails.role == 'MENTOR' && meeting.status != 'COMPLETED' && (
                                    <>
                                      <button
                                        onClick={() => handleEditMeeting(meeting.id)}
                                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                        title="Edit Meeting"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleJoinMeeting(meeting)}
                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                        title="Join Meeting"
                                      >
                                        <Play className="h-3 w-3 mr-1" />
                                        Join
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
            </div>
          </div>
        </div>

        {/* Feedback Popup Modal */}
        {showFeedbackPopup && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-2xl text-gray-900 font-medium">Share Your Experience</h3>
                <button onClick={closeFeedbackPopup} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={(e) => handleFeedbackSubmit(e, selectedMeeting.id)} className="p-6">
                <div className="space-y-6">
                  {/* Meeting Info */}
                  {selectedMeeting && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Meeting Details</h4>
                      <p className="text-sm text-gray-600">
                        Meeting ID: {selectedMeeting.meeting_id} | Date: {formatDate(selectedMeeting.date)}
                      </p>
                    </div>
                  )}

                  {/* Overall Rating */}
                  <div className="flex items-start">
                    <div className="w-32 mr-5 pt-2">
                      <label className="text-base font-medium text-gray-900">Overall Rating</label>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleStarClick(star)}
                            onMouseEnter={() => handleStarHover(star)}
                            onMouseLeave={handleStarLeave}
                            className="text-3xl transition-colors duration-200 focus:outline-none px-1"
                          >
                            <span
                              className={`${
                                star <= (hoveredStar || parseFloat(feedbackData.rating) || 0)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              } hover:text-yellow-400`}
                            >
                              ★
                            </span>
                          </button>
                        ))}
                      </div>
                      {feedbackData.rating && (
                        <p className="mt-2 text-sm text-gray-600">
                          You rated: {feedbackData.rating} star{feedbackData.rating !== '1' ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Feedback Section */}
                  <div className="flex items-start">
                    <div className="w-32 mr-5 pt-2">
                      <label htmlFor="feedback" className="text-base font-medium text-gray-900">
                        Your Feedback
                      </label>
                    </div>
                    <div className="flex-1">
                      <textarea
                        name="feedback"
                        id="feedback"
                        value={feedbackData.feedback}
                        onChange={handleFeedbackInputChange}
                        className="block w-full px-3 py-3 text-black placeholder-gray-500 transition-all bg-white border border-gray-200 rounded-md resize-y focus:outline-none focus:border-blue-600 caret-blue-600"
                        rows="6"
                        placeholder="Please share your experience with this mentoring session..."
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeFeedbackPopup}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingFeedback || !feedbackData.feedback.trim() || !feedbackData.rating}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
