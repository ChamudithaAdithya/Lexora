import React, { useEffect, useState } from 'react';
import { Eye, Briefcase, Calendar, X, User2, MapPin, Star, Clock } from 'lucide-react';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/TopHeader';
import userProfileHandleService from '../../../services/userProfileHandleService';
import Alert from '../../../component/template/alert/Alert';

export default function MentorDashboardNew() {
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const adminDetails = JSON.parse(localStorage.getItem('admin'));

  useEffect(() => {
    fetchApprovedMentors();
  }, []);

  const fetchApprovedMentors = async () => {
    try {
      setLoading(true);
      const response = await userProfileHandleService.getAllVerificationRequests();
      if (response.status === 200) {
        // Filter only approved mentors
        const approvedMentors = response.data.filter((request) => request.verificationStatus === 'ACCEPTED');
        setMentors(approvedMentors);
      }
    } catch (error) {
      setAlertMessage('Failed to fetch mentors');
      setAlertType('error');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMentor = (mentor) => {
    setSelectedMentor(mentor);
    setShowModal(true);
  };

  const filteredMentors = mentors.filter((mentor) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      mentor.first_name?.toLowerCase().includes(searchLower) ||
      mentor.last_name?.toLowerCase().includes(searchLower) ||
      mentor.name?.toLowerCase().includes(searchLower) ||
      mentor.occupation?.toLowerCase().includes(searchLower) ||
      mentor.company?.toLowerCase().includes(searchLower) ||
      mentor.career?.toLowerCase().includes(searchLower)
    );
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

  // Modern star rating component
  const StarRating = ({ rating, size = 'sm', showRating = true }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const starSize = size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5';

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className={`${starSize} text-yellow-400 fill-yellow-400`} />);
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className={`${starSize} text-gray-300 fill-gray-300`} />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star className={`${starSize} text-yellow-400 fill-yellow-400`} />
          </div>
        </div>
      );
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className={`${starSize} text-gray-300 fill-gray-300`} />);
    }

    return (
      <div className="flex items-center gap-1">
        <div className="flex items-center">{stars}</div>
        {showRating && (
          <span className={`${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'} text-gray-600 ml-1`}>
            {rating.toFixed(1)}
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      {alertMessage && <Alert message={alertMessage} type={alertType} />}
      <div className="flex h-screen overflow-hidden bg-white">
        <SidebarSub />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <TopHeader HeaderMessage={'Mentor Dashboard'} />

          <div className="flex-1 flex m-2 flex-col pt-5 pl-5 overflow-auto">
            {/* Page Header */}
            <div className="mb-6">
              <p className="text-gray-600">View and manage all approved mentors in the platform</p>
            </div>

            {/* Mentors Grid */}
            <div className="overflow-auto">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading mentors...</p>
                </div>
              ) : filteredMentors.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {searchTerm ? 'No mentors found matching your search' : 'No approved mentors found'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {filteredMentors.map((mentor) => (
                    <div
                      key={mentor.id}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                    >
                      {/* Profile Section */}
                      <div className="flex items-center mb-4">
                        <div className="flex-shrink-0">
                          <img
                            src={'data:image/jpeg;base64,' + mentor.profile_image}
                            className="h-16 w-16 rounded-full object-cover"
                            alt="Profile"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {mentor.first_name} {mentor.last_name}
                          </h3>
                          <p className="text-sm text-gray-600">{mentor.name}</p>
                          <div className="flex items-center mt-1">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Verified Mentor
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Professional Info */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{mentor.occupation || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{mentor.company || 'No company'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{mentor.experience || '0'} years experience</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{mentor.career || 'Not specified'}</span>
                        </div>

                        {/* Rating in dashboard card */}
                        <div className="flex items-center">
                          <StarRating rating={4.8} size="sm" />
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          Joined: {formatDate(mentor.created_at || new Date().toISOString())}
                        </div>
                        <button
                          onClick={() => handleViewMentor(mentor)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details Modal */}
        {showModal && selectedMentor && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Mentor Profile</h3>
                    <p className="text-gray-600 mt-1">
                      <User2 className="h-4 w-4 inline mr-2" />
                      Mentor ID: {selectedMentor.id}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Approved Date: {formatDateTime(selectedMentor.dateTime)}
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Profile Info */}
                  <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="text-center mb-4">
                        <img
                          src={'data:image/jpeg;base64,' + selectedMentor.profile_image}
                          className="h-24 w-24 rounded-full mx-auto mb-4 object-cover"
                          alt="Profile"
                        />
                        <h4 className="text-xl font-semibold text-gray-900">
                          {selectedMentor.first_name} {selectedMentor.last_name}
                        </h4>
                        <h4 className="text-lg font-medium text-gray-700 mb-2">{selectedMentor.name}</h4>
                        <p className="text-gray-600 text-sm">User ID: {selectedMentor.user_id}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-center">
                          <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                            Verified Mentor
                          </span>
                        </div>

                        {/* Rating moved here below verified mentor tag */}
                        <div className="text-left">
                          <StarRating rating={4.8} size="md" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Detailed Info */}
                  <div className="lg:col-span-2">
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
                            <p className="text-gray-900 mt-1">{selectedMentor.occupation || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Company</label>
                            <p className="text-gray-900 mt-1">{selectedMentor.company || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Experience</label>
                            <p className="text-gray-900 mt-1">{selectedMentor.experience || '0'} years</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Career Field</label>
                            <p className="text-gray-900 mt-1">{selectedMentor.career || 'Not specified'}</p>
                          </div>
                          {selectedMentor.role && (
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-gray-700">Role</label>
                              <p className="text-gray-900 mt-1">{selectedMentor.role}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Statistics - Now styled consistently with Professional Information */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Star className="h-5 w-5 mr-2" />
                          Mentor Statistics
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Total Mentees</label>
                            <p className="text-gray-900 mt-1">0</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Sessions Completed</label>
                            <p className="text-gray-900 mt-1">0</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
