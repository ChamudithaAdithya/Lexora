import React, { useEffect, useState } from 'react';
import { Eye, CheckCircle, Briefcase, Calendar, X, FileText, File, IdCard, User2, XIcon } from 'lucide-react';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/TopHeader';
import userProfileHandleService from '../../../services/userProfileHandleService';
import Alert from '../../../component/template/alert/Alert';
import axios from 'axios';

export default function AdminMentorRequests() {
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  const adminDetails = JSON.parse(localStorage.getItem('admin'));

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  const fetchVerificationRequests = async () => {
    try {
      setLoading(true);
      const response = await userProfileHandleService.getAllVerificationRequests();
      if (response.status === 200) {
        setVerificationRequests(response.data);
      }
    } catch (error) {
      setAlertMessage('Failed to fetch verification requests');
      setAlertType('error');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleOpenPdf = () => {
    if (selectedRequest?.degree_certificate) {
      setShowPdfModal(true);
    }
  };

  const sendNotificationToUser = async (user_id, notification, message) => {
    try {
      const notificationData = {
        reciever: { user_id: user_id },
        notification: notification,
        message: message,
      };
      console.log('Notification sent successfully', notificationData);
      await axios.post('http://www.localhost:8080/api/v2/notification', notificationData);
    } catch (error) {
      console.log('Error sending notification:', error);
    }
  };

  const handleRequestResponse = async (requestId, user_id, status) => {
    const confirmed = confirm(`Are you sure you want to ${status.toLowerCase()} this mentor request?`);
    if (confirmed) {
      try {
        const response = await userProfileHandleService.ResponseVerificationRequest(requestId, status);
        if (response.status === 200 || response.status === 201) {
          fetchVerificationRequests(); // Refresh the list
          setShowModal(false);
        }
        if (status === 'ACCEPTED') {
          setAlertMessage(`Request accepted successfully`);
          setAlertType('success');
          sendNotificationToUser(
            user_id,
            '🎉 Congratulations! Your mentor request has been approved.',
            "Welcome aboard as a mentor! We're excited to have you join our community of experts. Your experience and knowledge will be invaluable in guiding mentees on their career journeys. You can now access your mentor dashboard to start connecting with mentees, share your insights, and make a meaningful impact. Thank you for your commitment to helping others grow!"
          );
        } else if (status === 'REJECTED') {
          setAlertMessage(`Request rejected successfully`);
          setAlertType('success');
          sendNotificationToUser(
            user_id,
            '❌ Mentor Request Update',
            "We appreciate your interest in becoming a mentor. After careful review, we regret to inform you that your mentor request has not been approved at this time. We encourage you to continue developing your skills and expertise, and you're welcome to reapply in the future. Thank you for your understanding and continued interest in supporting our community."
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status.trim().toUpperCase().replaceAll('"', '')) {
      case 'NULL':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'ACCEPTED':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Approved</span>;
      case 'REJECTED':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  const filteredRequests = verificationRequests.filter((request) => {
    if (filter === 'all') return true;
    if (filter === 'NULL') {
      return request.verificationStatus === null;
    }
    return request.verificationStatus === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get request counts for each status
  const getRequestCounts = () => {
    const counts = {
      all: verificationRequests.length,
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    verificationRequests.forEach((request) => {
      const status = request.verificationStatus?.trim().toUpperCase().replaceAll('"', '');
      if (status === 'NULL' || !status) counts.pending++;
      else if (status === 'ACCEPTED') counts.approved++;
      else if (status === 'REJECTED') counts.rejected++;
    });

    return counts;
  };

  const requestCounts = getRequestCounts();

  return (
    <>
      {alertMessage && <Alert message={alertMessage} type={alertType} />}
      <div className="flex h-screen overflow-hidden bg-white">
        <SidebarSub />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <TopHeader HeaderMessage={'Mentor Verification'} />

          <div className="flex-1 flex m-5 flex-col pt-5 pl-10 overflow-auto">
            {/* Page Header */}
            <div className="mb-6">
              <p className="text-gray-600">Review and manage mentor verification requests from users</p>
            </div>

            {/* Filter Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {[
                  { key: 'all', label: `All Requests (${requestCounts.all})` },
                  { key: 'NULL', label: `Pending (${requestCounts.pending})` },
                  { key: 'ACCEPTED', label: `Approved (${requestCounts.approved})` },
                  { key: 'REJECTED', label: `Rejected (${requestCounts.rejected})` },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    className={`py-4 px-1 font-medium text-sm ${
                      filter === key ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setFilter(key)}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Requests Table */}
            <div className="mr-8">
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="ml-2 text-gray-600">Loading verification requests...</span>
                  </div>
                ) : filteredRequests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No verification requests found</h3>
                    <p className="text-sm text-gray-500">
                      {verificationRequests.length === 0
                        ? 'No mentor verification requests available'
                        : `No ${
                            filter === 'all' ? '' : filter === 'NULL' ? 'pending' : filter.toLowerCase()
                          } requests found`}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Applicant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Professional Info
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Experience
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Request Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRequests.reverse().map((request) => (
                          <tr key={request.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0">
                                  <img
                                    src={'data:image/jpeg;base64,' + request.profile_image}
                                    className="h-10 w-10 rounded-full"
                                    alt="Profile"
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {request.first_name} {request.last_name}
                                  </div>
                                  <div className="text-sm text-gray-500">ID: {request.user_id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Briefcase className="h-4 w-4 text-gray-400 mr-1" />
                                  <span className="">{request.occupation || 'Not specified'}</span>
                                </div>
                                <div className="text-gray-500 mt-1">@{request.company || 'No company'}</div>
                                <div className="text-gray-500 text-xs mt-1">{request.career || 'Not specified'}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">
                                <div className="">{request.experience || '0'} years</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(JSON.stringify(request.verificationStatus))}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-900">
                                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                <div>
                                  <div className="text-gray-600 text-sm">
                                    {formatDate(request.created_at || new Date().toISOString())}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleViewRequest(request)}
                                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </button>
                                {request.verificationStatus === null && (
                                  <>
                                    <button
                                      onClick={() => handleRequestResponse(request.id, request.user_id, 'ACCEPTED')}
                                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                      title="Approve Request"
                                    >
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleRequestResponse(request.id, request.user_id, 'REJECTED')}
                                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                      title="Reject Request"
                                    >
                                      <XIcon className="h-3 w-3 mr-1" />
                                      Reject
                                    </button>
                                  </>
                                )}
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
        </div>

        {/* Details Modal */}
        {showModal && selectedRequest && (
          <div className="fixed inset-0 bg-gray-600 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 shadow w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Become A Mentor Request</h3>

                    <p className="text-gray-600 mt-1">
                      <IdCard className="h-4 w-4 inline mr-2" />
                      Request ID: {selectedRequest.id}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Request Date: {formatDateTime(selectedRequest.dateTime)}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
                  {/* Left Column - Profile Info */}
                  <div className="lg:col-span-5">
                    <div className=" rounded-lg p-6">
                      <div className="text-center mb-4">
                        <img
                          src={'data:image/jpeg;base64,' + selectedRequest.profile_image}
                          className="h-24 w-24 rounded-full mx-auto mb-4"
                          alt="Profile"
                        />
                        <h4 className="text-xl font-semibold text-gray-900">
                          {selectedRequest.first_name} {selectedRequest.last_name}
                        </h4>
                        <h4 className="text-lg font-semibold text-gray-900">
                          <User2 className="h-4 w-4 inline mr-2" />
                          {selectedRequest.name}
                        </h4>
                        <p className="text-gray-600">User ID: {selectedRequest.user_id}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-center">
                          {getStatusBadge(JSON.stringify(selectedRequest.verificationStatus))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Detailed Info */}
                  <div className="lg:col-span-3">
                    <div className="space-y-6">
                      {/* Professional Information */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Briefcase className="h-5 w-5 mr-2" />
                          Professional Information
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Occupation</label>
                            <p className="text-gray-900">{selectedRequest.occupation || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Company</label>
                            <p className="text-gray-900">{selectedRequest.company || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Experience</label>
                            <p className="text-gray-900">{selectedRequest.experience || '0'} years</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Career Field</label>
                            <p className="text-gray-900">{selectedRequest.career || 'Not specified'}</p>
                          </div>
                          {selectedRequest.role && (
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-gray-700">Role</label>
                              <p className="text-gray-900">{selectedRequest.role}</p>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center mt-5">
                            <FileText className="h-5 w-5 mr-2" />
                            Degree Certificate
                          </h5>
                          {selectedRequest.degree_certificate ? (
                            <div className="flex items-center space-x-4">
                              <div className="flex-1">
                                <div className="flex space-x-3">
                                  <button
                                    onClick={handleOpenPdf}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  >
                                    <File className="h-4 w-4 mr-2" />
                                    Open PDF File
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-500">No certificate uploaded</p>
                          )}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      {selectedRequest.verificationStatus === null && (
                        <div className=" rounded-lg p-6 w-full flex justify-center">
                          <div className="flex space-x-4">
                            <button
                              onClick={() => handleRequestResponse(selectedRequest.id, 'ACCEPTED')}
                              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              ACCEPT
                            </button>
                            <button
                              onClick={() => handleRequestResponse(selectedRequest.id, 'REJECTED')}
                              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <XIcon className="h-4 w-4 mr-2" />
                              REJECT
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PDF Modal */}
        {showPdfModal && selectedRequest?.degree_certificate && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-60">
            <div className="relative top-4 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white min-h-[90vh]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{selectedRequest.name}</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowPdfModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="h-full">
                <iframe
                  src={`data:application/pdf;base64,${selectedRequest.degree_certificate}`}
                  className="w-full h-[80vh] border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
