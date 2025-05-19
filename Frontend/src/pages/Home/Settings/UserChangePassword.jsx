import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/TopHeader';
import userProfileHandleService from '../../../services/userProfileHandleService';
import { Link } from 'react-router-dom';
import Alert from '../../../component/template/alert/Alert';

export default function UserChangePassword() {
  const [activeTab, setActiveTab] = useState('Password');
  const [passwordCorrect, setPasswordCorrent] = useState(true);
  const [currentPasswordValid, setCurrentPasswordValid] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');
  const tabs = {
    Profile: '/settings/profile',
    Password: '/settings/password',
    'professional Details': '/settings/professionalDetails',
  };
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '' });
  const [profileDetails, setProfileDetails] = useState('');

  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAllertType] = useState('');

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlertMessage(''); // Clear previous alerts

    userProfileHandleService
      .changePassword(formData)
      .then((response) => {
        if (response.status === 200) {
          setAlertMessage(response.data);
          setAllertType('success');
        } else {
          setAlertMessage('Failed to change password');
          setAllertType('error');
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setAlertMessage('Bad Request, Please check your input fields');
          setAllertType('error');
        } else {
          setAlertMessage('Network Failure');
          setAllertType('error');
        }
      });
  };

  useEffect(() => {
    userProfileHandleService.findUserProfileById(1).then((response) => {
      setProfileDetails(response.data);
      console.log(response.data);
    });
  },[]);

  const handleIfthePasswordsAreMatches = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordCorrent(formData.newPassword === value);
  };

  return (
    <>
      {alertMessage && <Alert message={alertMessage} type={alertType} />}
      <div className="flex h-screen overflow-hidden bg-white">
        {/* Fixed Sidebar */}
        <SidebarSub />

        {/* Main Content Area with Independent Scrolling */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Fixed Header */}
          <TopHeader HeaderMessage={'Settings'} />

          <div className="flex-1 bg-white flex m-5 flex-col pt-5 pl-10 overflow-auto">
            {/* Tab navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {Object.entries(tabs).map(([key, value]) => (
                  <Link to={value} key={key}>
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
            <form onSubmit={handleSubmit}>
              {/* Profile content */}
              <div className="max-w-3xl">
                <div className="mb-6">
                  <div className="w-full flex justify object-center mb-4">
                    <h2 className=" text-lg font-medium mb-2 object-center">Change Password</h2>
                    {!currentPasswordValid && (
                      <p className=" ml-5 text-sm text-red-600">* Current Password Incorrent</p>
                    )}
                  </div>

                  <p className="text-gray-500 text-sm">
                    Currently existing password will confirm that u are the corrent user to allow change the password
                  </p>
                </div>

                {/* Current Password */}
                <div className="flex mb-6 justify object-center">
                  <div className="w-35 mr-5">
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  </div>
                  <div className="flex-1">
                    <input
                      required
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handlePasswordChange}
                      minLength={8}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                {/* New Password */}
                <div className="flex mb-6 object-center">
                  <div className="w-35 mr-5">
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                  </div>
                  <div className="flex-1">
                    <input
                      required
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      minLength={8}
                      onChange={handlePasswordChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                {/* Confirm Password */}
                <div className="w-full flex justify-end object-center mb-4">
                  {!passwordCorrect && <p className="text-sm text-red-600">* Password does not match</p>}
                </div>
                <div className="flex mb-6 object-center">
                  <div className="w-35 mr-5">
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  </div>
                  <div className="flex-1">
                    <input
                      required
                      type="password"
                      value={confirmPassword}
                      onChange={handleIfthePasswordsAreMatches}
                      minLength={8}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* Update button */}
                <div className="ml-40 ">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 cursor-pointer"
                  >
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
