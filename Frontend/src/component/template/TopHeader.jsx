import React, { useState, useEffect } from 'react';
import { Globe, ChevronDown, Search, Home, User, Settings, LogOut, Bell } from 'lucide-react';
import { authService } from '../../services/AuthService';
import userProfileHandleService from '../../services/userProfileHandleService';

const categories = [
  'Software Development & Engineering',
  'Data Science & Analytics',
  'Design & Creative',
  'Marketing & Communications',
  'Business & Management',
  'Healthcare & Medicine',
];

export default function TopHeader({ HeaderMessage }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [profileDetails, setProfileDetails] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user.user_id && user.token) {
      userProfileHandleService.findUserProfileById(user.user_id).then((response) => {
        setProfileDetails(response.data);
        console.log(response.data);
      });
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowProfileDropdown(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle dropdown toggle without propagating events
  const toggleDropdown = (setter, currentState, e) => {
    e.stopPropagation();
    setter(!currentState);
  };

  return (
    <>
      <header className="bg-white p-1 shadow-sm z-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl pl-5 font-bold text-gray-800">{HeaderMessage}</h1>
          </div>

          <div className="flex items-center  mt-4 md:mt-0">
            <button className="p-2 flex-col-reverse align-middle text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2  border-gray-200 rounded-lg px-3 py-2 hover:border-blue-300 transition-colors duration-200 bg-white"
                onClick={(e) => toggleDropdown(setShowProfileDropdown, showProfileDropdown, e)}
              >
                <img src={profileDetails.profile_image} className="h-10 w-10 object-cover rounded-full " />
                <div className="flex justify-start object-center flex-col mr-3">
                  <span className="text-sm font-medium hidden md:inline pl-2">{profileDetails.username}</span>
                  <span style={{ fontSize: '0.7em' }} className="font-medium hidden md:inline pl-2 text-gray-800">
                    {profileDetails.role || 'Student'}
                  </span>
                </div>
                <ChevronDown size={14} className="text-gray-500" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 pl-2 mr-2">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-semibold">{profileDetails.username}</p>
                    <p className="text-xs text-gray-500">{profileDetails.email}</p>
                  </div>
                  <ul className="py-1">
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-gray-700">
                      <Home size={17} className="text-gray-500" />
                      <span className="text-m">Home</span>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-gray-700">
                      <User size={17} className="text-gray-500" />
                      <span className="text-m">Profile</span>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-gray-700">
                      <Settings size={17} className="text-gray-500" />
                      <span className="text-m">Settings</span>
                    </li>
                    <li className="border-t border-gray-100 mt-1">
                      <button
                        onClick={() => authService.logout()}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-red-600"
                      >
                        <LogOut size={17} className="text-red-500" />
                        <span className="text-m">Logout</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
            <span>›</span>
            <span className="hover:text-blue-600 cursor-pointer">Analytics</span>
            <span>›</span>
            <span className="text-blue-600 font-medium">Job Trends</span>
          </div>
        </div>
      </div>
    </>
  );
}
