import React, { useEffect, useState } from 'react';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/TopHeader';
import userProfileHandleService from '../../../services/userProfileHandleService';
import { Link } from 'react-router-dom';
import Alert from '../../../component/template/alert/Alert';

export default function UserProfileSettings() {
  const [activeTab, setActiveTab] = useState('Profile');
  const tabs = {
    Profile: '/settings/profile',
    Password: '/settings/password',
    'professional Details': '/settings/professionalDetails',
  };

  const [profileDetails, setProfileDetails] = useState({
    f_name: '',
    l_name: '',
    email: '',
    bio: '',
    username: '',
    profile_image: '',
  });

  const [profileImage, setProfileImage] = useState();
  const [previewImage, setPreviewImage] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  useEffect(() => {
    userProfileHandleService.findUserProfileById(1).then((response) => {
      const userData = response.data || {};
      setProfileDetails({
        f_name: userData.f_name || '',
        l_name: userData.l_name || '',
        email: userData.email || '',
        bio: userData.bio || '',
        username: userData.username || '',
        profile_image: userData.profile_image || '',
      });
      console.log(response.data);
    });
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const uploadProfileImage = async (e) => {
    e.preventDefault();
    setAlertMessage('');

    try {
      await userProfileHandleService.uploadProfileImage(profileImage).then((response) => {
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
        setAlertMessage("Image file is large, can't update");
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
    const updatedDetails = {
      ...profileDetails,
      profile_image: null,
    };

    const confirmed = confirm('Are you sure you want to update the profile ?');
    if (confirmed) {
      try {
        const response = await userProfileHandleService.updateProfileDetails(updatedDetails);
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
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Profile</h2>
                <p className="text-gray-500 text-sm">Lorem ipsum dolor sit amet, consectetur adipis.</p>
              </div>
              <form onSubmit={uploadProfileImage} enctype="multipart/form-data">
                {/* Profile Photo */}
                <div className="flex items-center mb-6">
                  <div className="w-35 mr-5">
                    <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                  </div>
                  <div className="flex flex-col items-center space-x-4">
                    <div class="flex items-center space-x-6">
                      <div class="shrink-0">
                        <img
                          id="preview_img"
                          class="h-16 w-16 object-cover rounded-full"
                          src={previewImage ? previewImage : profileDetails.profile_image}
                          alt="Current profile photo"
                        />
                      </div>

                      <label class="block">
                        <span class="sr-only">Choose profile photo</span>
                        <input
                          type="file"
                          onChange={handleImage}
                          class="block w-full text-sm text-slate-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-violet-50 file:text-violet-700
        hover:file:bg-violet-100
      "
                        />
                      </label>
                    </div>
                    <div>
                      <button className="text-gray-500 text-sm hover:text-gray-700 cursor-pointer">Remove</button>
                      <button className="text-blue-500 text-sm font-medium hover:text-blue-700 cursor-pointer">
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              <form onSubmit={handleProfileUpdate}>
                {/* First & Last Name */}
                <div className="flex mb-6">
                  <div className="w-35 mr-5">
                    <label className="block text-sm font-medium text-gray-700">First & Last Name</label>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="f_name"
                      onChange={handleProfileDetailsChange}
                      value={profileDetails.f_name}
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      onChange={handleProfileDetailsChange}
                      name="l_name"
                      value={profileDetails.l_name}
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex mb-6">
                  <div className="w-35 mr-5">
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  </div>
                  <div className="flex-1">
                    <input
                      type="email"
                      name="email"
                      onChange={handleProfileDetailsChange}
                      value={profileDetails.email}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="flex mb-6">
                  <div className="w-35 mr-5">
                    <label className="block text-sm font-medium text-gray-700">Write Your Bio</label>
                  </div>
                  <div className="flex-1">
                    <textarea
                      placeholder="Write about you"
                      value={profileDetails.bio}
                      rows={4}
                      name="bio"
                      onChange={handleProfileDetailsChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    ></textarea>
                  </div>
                </div>

                {/* Username */}
                <div className="flex mb-6">
                  <div className="w-35 mr-5">
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <p className="text-xs text-gray-500 mt-1">You can change it later</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        lexora/
                      </span>
                      <input
                        type="text"
                        value={profileDetails.username}
                        name="username"
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
                    Update
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
