// RequestedSessionsPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, Mail, Users, MessageSquare, Search, CheckCircle, XCircle, User, Plus } from 'lucide-react';
import axios from 'axios';
import SidebarSub from '../../../../component/template/SidebarSub';
import TopHeader from '../../../../component/template/TopHeader';
import Alert from '../../../../component/template/alert/Alert';

export default function RequestedSessionsPage() {
  const navigate = useNavigate();
  const { mentor_id } = useParams();
  const { user_id } = useParams(0);

  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestedSessions, setRequestedSessions] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const handleGetUserDetails = (e) => {
    console.log('This is the user details', e);
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

  // Fetch requested sessions data
  const fetchRequestedSessions = async () => {
    try {
      setLoading(true);
      if (userDetails.role == 'MENTOR') {
        const response = await axios.get(
          `http://localhost:8080/api/v2/matchmaking/requestSession/${user_id}/${mentor_id}`
        );
        console.log('This is the response ', response.data);
        setRequestedSessions(response.data);
      } else {
        const response = await axios.get(
          `http://localhost:8080/api/v2/matchmaking/requestSession/${mentor_id}/${user_id}`
        );
        console.log('This is the response ', response.data);
        setRequestedSessions(response.data);
      }
    } catch (error) {
      console.error('Error fetching requested sessions:', error);
      showAlert('Failed to fetch requested sessions. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userDetails && userDetails.user_id) {
      fetchRequestedSessions();
    }
  }, [userDetails]);

  // Get status badge styling
  const getStatusBadge = (status) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'PENDING':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'ACCEPTED':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'REJECTED':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Function to send notification to the user. This function can be called after a session request is successfully sent.
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

  // Handle Approve Session (for mentors)
  const handleApproveSession = async (sessionId, user_id) => {
    try {
      await axios.put(`http://localhost:8080/api/v2/matchmaking/requestSession/${sessionId}/ACCEPTED`);
      showAlert('Session request approved successfully!', 'success');
      sendNotificationToUser(
        user_id,
        `Session Request Approved by the Mentor. Menotr ID: ${userDetails.user_id}`,
        'Your session request has been approved by the mentor. Now you can join the session that will be created soon by the mentor. Be on time the session is created.'
      );
      fetchRequestedSessions(); // Refresh the list
    } catch (error) {
      console.error('Error approving session:', error);
      showAlert('Failed to approve session. Please try again.', 'error');
    }
  };

  // Handle Reject Session (for mentors)
  const handleRejectSession = async (sessionId, user_id) => {
    if (window.confirm('Are you sure you want to reject this session request?')) {
      try {
        await axios.put(`http://localhost:8080/api/v2/matchmaking/requestSession/${sessionId}/REJECTED`);
        showAlert('Session request rejected successfully!', 'success');
        sendNotificationToUser(
          user_id,
          'Session Request Rejected by the Mentor',
          'Your session request has been rejected by the mentor. You can try requesting another session with a different time.'
        );
        fetchRequestedSessions(); // Refresh the list
      } catch (error) {
        console.error('Error rejecting session:', error);
        showAlert('Failed to reject session. Please try again.', 'error');
      }
    }
  };

  // Handle Cancel Request (for students)
  const handleCancelRequest = async (sessionId) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      try {
        await axios.delete(`http://localhost:8080/api/v2/matchmaking/requestSession/${sessionId}`);
        showAlert('Request cancelled successfully!', 'success');
        fetchRequestedSessions(); // Refresh the list
      } catch (error) {
        console.error('Error cancelling request:', error);
        showAlert('Failed to cancel request. Please try again.', 'error');
      }
    }
  };

  // Filter sessions based on search
  const filteredSessions = requestedSessions.filter((session) => {
    const mentorName =
      `${session.mentor.f_name || ''} ${session.mentor.l_name || ''}`.trim() || session.mentor.username;
    const mentorEmail = session.mentor.email;

    const matchesSearch =
      mentorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.status.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Format date and time to display
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  return (
    <>
      {alertMessage && <Alert message={alertMessage} type={alertType} />}
      <div className="flex h-screen overflow-hidden bg-white">
        <SidebarSub />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <TopHeader HeaderMessage={'Requested Meetings'} handleGetUserDetails={handleGetUserDetails} />

          <div className="flex-1 flex m-5 flex-col pt-5 pl-10 overflow-auto">
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className=" text-s text-gray-900 flex items-center">
                    {userDetails.role === 'MENTOR'
                      ? 'Manage incoming session requests from students'
                      : 'View your sent session requests and their status'}
                  </h3>
                </div>
                {userDetails.role == 'STUDENT' && (
                  <button
                    onClick={() => navigate('/mentorDashboardNew')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Session Request
                  </button>
                )}
              </div>
            </div>

            {/* Sessions Table */}
            <div className="mr-8">
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="ml-2 text-gray-600">Loading requested sessions...</span>
                  </div>
                ) : filteredSessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No session requests found</h3>
                    <p className="text-sm text-gray-500">
                      {requestedSessions.length === 0
                        ? userDetails.role === 'MENTOR'
                          ? 'No incoming session requests at the moment'
                          : "You haven't requested any sessions yet"
                        : 'Try adjusting your search criteria'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Request ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {userDetails.role === 'MENTOR' ? 'Student Details' : 'Mentor Email'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Requested Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Requested Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {userDetails.role === 'MENTOR' ? 'Student Message' : 'Mentor Message'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSessions.map((session) => {
                          const { date, time } = formatDateTime(session.requested_time);
                          const displayName =
                            `${session.mentor.f_name || ''} ${session.mentor.l_name || ''}`.trim() ||
                            session.mentor.username;
                          return (
                            <tr key={session.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">#{session.id}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="text-sm text-gray-500 flex items-center">
                                    {userDetails.role === 'MENTOR' ? session.mentee_email : session.mentor.email}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center text-sm text-gray-900">
                                  <div>
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                      <span className="text-gray-900">{date}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center text-sm text-gray-900">
                                  <div>
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                      <span className="text-gray-900">{time}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={getStatusBadge(session.status)}>{session.status}</span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="max-w-xs">
                                  <p>
                                    {userDetails.role === 'MENTOR'
                                      ? session.mentee_message === ''
                                        ? 'No Messages'
                                        : session.mentee_message
                                      : session.mentor_message === ''
                                      ? 'No Messages'
                                      : session.mentor_message}
                                  </p>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  {userDetails.role === 'MENTOR' && session.status === 'PENDING' && (
                                    <>
                                      <button
                                        onClick={() => handleApproveSession(session.id, session.user_id)}
                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                        title="Approve Request"
                                      >
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => handleRejectSession(session.id, session.user_id)}
                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                        title="Reject Request"
                                      >
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Reject
                                      </button>
                                    </>
                                  )}
                                  {userDetails.role === 'MENTOR' && session.status === 'ACCEPTED' && (
                                    <>
                                      <button
                                        onClick={() => navigate(`/create-meeting/${session.mentor.user_id}`)}
                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                        title="Approve Request"
                                      >
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Create Session
                                      </button>
                                    </>
                                  )}
                                  {userDetails.role === 'STUDENT' && session.status === 'PENDING' && (
                                    <button
                                      onClick={() => handleCancelRequest(session.id)}
                                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                                      title="Cancel Request"
                                    >
                                      <XCircle className="h-3 w-3 mr-1" />
                                      Cancel
                                    </button>
                                  )}
                                  {userDetails.role === 'STUDENT' && session.status != 'PENDING' && (
                                    <span className="text-gray-400">No Action</span>
                                  )}
                                  {session.status == 'REJECTED' && (
                                    <span className="text-xs text-gray-400">No actions available</span>
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
      </div>
    </>
  );
}
