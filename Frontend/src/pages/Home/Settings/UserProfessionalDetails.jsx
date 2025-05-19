import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/TopHeader';
import userProfileHandleService from '../../../services/userProfileHandleService';
import { Link } from 'react-router-dom';
import Alert from '../../../component/template/alert/Alert';

export default function UserProfessionalDetails() {
  const [activeTab, setActiveTab] = useState('professional Details');
  const tabs = {
    Profile: '/settings/profile',
    Password: '/settings/password',
    'professional Details': '/settings/professionalDetails',
  };

  const [profileDetails, setProfileDetails] = useState({
    occupation: '',
    company: '',
    experience: '',
    career: '',
    v_status: '',
  });

  const [degree_certificate, setDegree_certificate] = useState();
  const [previewImage, setPreviewImage] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  useEffect(() => {
    userProfileHandleService.findUserProfileById(1).then((response) => {
      const userData = response.data || {};
      setProfileDetails({
        occupation: userData.occupation || '',
        company: userData.company || '',
        experience: userData.experience || '',
        career: userData.career || '',
        v_status: userData.v_status || '',
        degree_certificate: userData.degree_certificate || '',
      });
      console.log(response.data);
    });
  }, []);

  const handleVerificationDetails = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDegree_certificate(file);
    }
  };

  const uploadProfileImage = async (e) => {
    e.preventDefault();
    setAlertMessage('');

    try {
      await userProfileHandleService.requestVerifyAccount(degree_certificate).then((response) => {
        console.log(response);
        if (response.status == 200) {
          setAlertMessage(response.data);
          setAlertType('success');
        }
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setAlertMessage('Server Error ');
        setAlertType('error');
      } else {
        setAlertMessage("File is large, can't update");
        setAlertType('error');
      }
    }
  };

  const handleProfileDetailsChange = (e) => {
    const { name, value } = e.target;
    setProfileDetails({
      ...profileDetails,
      [name]: value,
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setAlertMessage('');
    const updatedDetails = { ...profileDetails };
    delete updatedDetails.degree_certificate;
    delete updatedDetails.v_status;

    const confirmed = confirm('Are you sure you want to update current professional Details ?');

    if (confirmed) {
      try {
        const response = await userProfileHandleService.updateProfessionalDetails(updatedDetails);
        if (response.status === 200) {
          setAlertMessage('Profile updated successfully');
          setAlertType('success');
        }
      } catch (error) {
        setAlertMessage(error.response?.data || 'Failed to update profile');
        setAlertType('error');
      }
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
          <TopHeader HeaderMessage={'Settings'} />

          <div className="flex-1 flex m-5 flex-col pt-5 pl-10 overflow-auto">
            {/* Tab navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {Object.entries(tabs).map(([key, value]) => (
                  <Link to={value}>
                    <button
                      key={key}
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
                  <p className="text-sm text-red-600">* Not verified</p>
                </div>
                <p className="text-gray-500 text-sm">
                  It is important to Update your professional details to get verified as a mentor
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
                      type="career"
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
                      type="occupation"
                      name="occupation"
                      onChange={handleProfileDetailsChange}
                      value={profileDetails.occupation}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* company */}
                <div className="flex mb-6">
                  <div className="w-35 mr-5">
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                  </div>
                  <div className="flex-1">
                    <div className="flex rounded-md shadow-sm">
                      <input
                        type="text"
                        value={profileDetails.company}
                        name="company"
                        onChange={handleProfileDetailsChange}
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex mb-6">
                  <div className="w-35 mr-5">
                    <label className="block text-sm font-medium text-gray-700">Experiance</label>
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
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 text-sm"
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
                    Should have a at least a bacholor degree to get verified as a mentor
                  </p>
                </div>
                <form onSubmit={uploadProfileImage} enctype="multipart/form-data">
                  {/* Profile Photo */}
                  <div className="flex items-center mb-6">
                    <div className="w-35 mr-5">
                      <label className="block text-sm font-medium text-gray-700">Degree Cirtificate</label>
                    </div>
                    <div className="flex flex items-center space-x-4">
                      <div class="flex items-center space-x-6">
                        <label class="block">
                          <span class="sr-only">Choose Cirtificate</span>
                          <input
                            type="file"
                            onChange={handleVerificationDetails}
                            class="block w-full text-sm text-slate-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-violet-50 file:text-blue-700
        hover:file:bg-violet-100
      "
                          />
                        </label>
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                          Send Request
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
