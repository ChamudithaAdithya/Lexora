import React, { use, useEffect, useState } from 'react';
import {
  BellIcon,
  ChevronDown,
  File,
  GitPullRequestArrow,
  LucideGitPullRequestDraft,
  ReceiptPoundSterling,
  X,
} from 'lucide-react';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/TopHeader';
import userProfileHandleService from '../../../services/userProfileHandleService';
import { Link, useLocation } from 'react-router-dom';
import Alert from '../../../component/template/alert/Alert';
import axios from 'axios';

export default function UserProfessionalDetails() {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [activeTab, setActiveTab] = useState('professional Details');
  const tabs = {
    Profile: '/settings/profile',
    Password: '/settings/password',
    'professional Details': '/settings/professionalDetails',
  };

  const userDetails = JSON.parse(localStorage.getItem('user'));
  const [profileDetails, setProfileDetails] = useState({
    occupation: '',
    company: '',
    experience: '',
    career: '',
    v_status: '',
    degree_certificate: null,
  });

  const [degree_certificate, setDegree_certificate] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [enableBecomeMentorButton, setEnableBecomeMentorButton] = useState(false);

  const checkIfThereAlreadyExistBecomeMentorRequest = () => {
    userProfileHandleService
      .getVerificationRequestByUserId(userDetails.user_id)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.verificationStatus == null || response.data.verificationStatus == 'ACCEPTED') {
            setEnableBecomeMentorButton(false);
          } else {
            setEnableBecomeMentorButton(true);
          }
        }
      })
      .catch((error) => {
        setEnableBecomeMentorButton(true);
        console.error('Error fetching verification requests:', error);
      });
  };

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

  // Fetch initial profile details
  useEffect(() => {
    if (userDetails?.user_id) {
      // Fetch user Already exist requests
      checkIfThereAlreadyExistBecomeMentorRequest();
      // Fetch user profile details
      userProfileHandleService
        .findUserProfileById(userDetails.user_id)
        .then((response) => {
          const userData = response.data || {};
          setProfileDetails({
            occupation: userData.occupation || '',
            company: userData.company || '',
            experience: userData.experience || '',
            career: userData.career || '',
            v_status: userData.v_status || '',
            degree_certificate: userData.degree_certificate || null,
          });
          console.log('Profile details fetched:', response.data);
        })

        .catch((error) => {
          console.error('Error fetching profile details:', error);
          setAlertMessage('Failed to load profile details');
          setAlertType('error');
        });
    }
  }, [userDetails?.user_id]);

  // Fetch verification requests
  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  const fetchVerificationRequests = async () => {
    if (!userDetails?.user_id) return;
    try {
      const response = await userProfileHandleService.getVerificationRequestByUserId(userDetails.user_id);
      if (response.status === 200) {
        setVerificationRequests(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerificationDetails = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDegree_certificate(file);
      console.log('Selected file:', file);
    }
  };

  const uploadProfileImage = async (e) => {
    e.preventDefault();
    setAlertMessage('');
    setAlertType('');

    if (!degree_certificate) {
      setAlertMessage('Please choose a certificate file first');
      setAlertType('error');
      return;
    }

    try {
      const response = await userProfileHandleService.UploadDegreeCirtificate(degree_certificate, userDetails);
      console.log(response);
      if (response.status === 200) {
        setAlertMessage(response.data);
        setAlertType('success');
        // After successful upload, you might want to refresh profileDetails:
        setProfileDetails((prev) => ({
          ...prev,
          degree_certificate: response.data.fileUrl || prev.degree_certificate,
        }));
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        setAlertMessage('Server Error');
        setAlertType('error');
      } else {
        setAlertMessage('File is large or upload failed');
        setAlertType('error');
      }
    }
  };

  const handleProfileDetailsChange = (e) => {
    const { name, value } = e.target;
    setProfileDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenPdf = () => {
    setShowPdfModal(true);
  };

  const handleSendRequest = async () => {
    setAlertMessage('');
    setAlertType('');
    // Ensure required fields are present
    if (
      profileDetails.degree_certificate &&
      profileDetails.occupation.trim() !== '' &&
      profileDetails.company.trim() !== '' &&
      profileDetails.experience !== '' &&
      profileDetails.career.trim() !== ''
    ) {
      try {
        const response = await userProfileHandleService.sendBecomeAMentorRequest(userDetails.user_id);
        if (response.status === 200 || response.status === 201) {
          setAlertMessage(response.data);
          setAlertType('success');
          fetchVerificationRequests();
          checkIfThereAlreadyExistBecomeMentorRequest();
        }
        sendNotificationToUser(
          userDetails.user_id, // replace this with actual admin user id or list
          '📥 New Mentor Request Received',
          "A new mentor request has been submitted. Please review the applicant's details and proceed with the evaluation process."
        );
      } catch (error) {
        console.error('Error sending request:', error);
        setAlertMessage(error.response?.data || 'Please check your internet connection');
        setAlertType('error');
      }
    } else {
      setAlertMessage('Please upload your degree certificate and fill all fields to send a mentor request.');
      setAlertType('error');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setAlertMessage('');
    setAlertType('');
    const updatedDetails = { ...profileDetails };
    // Remove fields not needed server-side
    delete updatedDetails.degree_certificate;
    delete updatedDetails.v_status;

    const confirmed = window.confirm('Are you sure you want to update current professional details?');
    if (!confirmed) return;

    try {
      const response = await userProfileHandleService.updateProfessionalDetails(updatedDetails, userDetails.user_id);
      if (response.status === 200) {
        setAlertMessage('Profile updated successfully');
        setAlertType('success');
        // Optionally re-fetch profile details
      }
    } catch (error) {
      console.error(error);
      setAlertMessage(error.response?.data || 'Failed to update profile');
      setAlertType('error');
    }
  };

  return (
    <>
      {alertMessage && <Alert message={alertMessage} type={alertType} />}
      <div className="flex h-screen overflow-hidden bg-white">
        <SidebarSub />

        {/* Main Content Area with Independent Scrolling */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <TopHeader HeaderMessage="Settings" />

          <div className="flex-1 flex m-5 flex-col pt-5 pl-10 overflow-auto">
            {/* Tab navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {Object.entries(tabs).map(([key, value]) => (
                  <Link key={key} to={value}>
                    <button
                      className={`py-4 px-1 font-medium text-sm ${
                        activeTab === key
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab(key)}
                    >
                      {key}
                    </button>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Profile content */}
            <div className="max-w-3xl">
              <div className="mb-6 ">
                <div className="flex flex-row object-center items-center mb-2">
                  <h2 className="text-lg font-medium mr-2">Professional Details</h2>
                  {profileDetails.v_status !== 'ACCEPTED' ? (
                    <p className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">* Not verified</p>
                  ) : (
                    <p className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">Verified</p>
                  )}
                </div>
                <p className="text-gray-500 text-sm">
                  It is important to update your professional details to get verified as a mentor.
                </p>
              </div>

              <form onSubmit={handleProfileUpdate}>
                {/* Career */}
                <div className="flex mb-6">
                  <div className="w-35 mr-5">
                    <label className="block text-sm font-medium text-gray-700">Career</label>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      name="career"
                      onChange={handleProfileDetailsChange}
                      value={profileDetails.career}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* Occupation */}
                <div className="flex mb-6">
                  <div className="w-35 mr-5">
                    <label className="block text-sm font-medium text-gray-700">Occupation</label>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      name="occupation"
                      onChange={handleProfileDetailsChange}
                      value={profileDetails.occupation}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="flex mb-6">
                  <div className="w-35 mr-5">
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={profileDetails.company}
                      name="company"
                      onChange={handleProfileDetailsChange}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
                    />
                  </div>
                </div>

                {/* Experience */}
                <div className="flex mb-6">
                  <div className="w-35 mr-5">
                    <label className="block text-sm font-medium text-gray-700">Experience</label>
                  </div>
                  <div className="flex-1">
                    <div className="flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        In Years
                      </span>
                      <input
                        type="number"
                        value={profileDetails.experience}
                        name="experience"
                        placeholder="4"
                        onChange={handleProfileDetailsChange}
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-r-md border border-gray-300 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Update button */}
                <div className="ml-40">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Update Professional Details
                  </button>
                </div>
              </form>

              <div className="max-w-3xl mt-7">
                <div className="mb-6">
                  <h2 className="text-lg font-medium mb-2">Verify Account</h2>
                  <p className="text-gray-500 text-sm">
                    You should have at least a bachelor’s degree to get verified as a mentor.
                  </p>
                </div>
                <form onSubmit={uploadProfileImage} encType="multipart/form-data">
                  {/* Degree Certificate Upload */}
                  <div className="flex items-center mb-6">
                    <div className="w-35 mr-5">
                      <label className="block text-sm font-medium text-gray-700">Degree Certificate</label>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="block">
                        <span className="sr-only">Choose Certificate</span>
                        <input
                          type="file"
                          onChange={handleVerificationDetails}
                          className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-violet-50 file:text-blue-700
                            hover:file:bg-violet-100"
                        />
                      </label>
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                      >
                        Upload Certificate
                      </button>
                      {profileDetails.degree_certificate && (
                        <div className="flex space-x-3">
                          <button
                            onClick={handleOpenPdf}
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <File className="h-4 w-4 mr-2" />
                            View Existing
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
                {profileDetails.v_status !== 'ACCEPTED' && enableBecomeMentorButton && (
                  <div>
                    <button
                      onClick={handleSendRequest}
                      type="button"
                      className="bg-blue-500 text-white px-8 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                      <p className="flex items-center justify-center">
                        <GitPullRequestArrow className="h-4 w-4 mr-2" />
                        Become a Mentor
                      </p>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PDF Modal */}
        {showPdfModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-60">
            <div className="relative top-4 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white min-h-[90vh]">
              <div className="flex justify-end items-center mb-4">
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="h-full">
                <iframe
                  src={profileDetails.degree_certificate}
                  className="w-full h-[80vh] border border-gray-300 rounded"
                  title="Degree Certificate Preview"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
