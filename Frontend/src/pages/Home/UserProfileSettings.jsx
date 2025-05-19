import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SidebarSub from '../../component/template/SidebarSub';
import TopHeader from '../../component/template/TopHeader';
import userProfileHandleService from '../../services/userProfileHandleService';

export default function UserProfileSettings() {
  const [activeTab, setActiveTab] = useState('Profile');
  const tabs = ['Profile', 'Password'];
  const [userData, setUserData] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    console.log('USERRRRRRRRRRRRR', user);
    userProfileHandleService.findUserProfileById(user.user_id).then((response) => {
      setUserData(response.data);
      console.log(response.data);
    });
  }, []);

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Fixed Sidebar */}
        <SidebarSub />

        {/* Main Content Area with Independent Scrolling */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Fixed Header */}
          <TopHeader />

          <div className="flex-1 flex m-5 flex-col pt-5 pl-10 overflow-auto">
            {/* Settings title */}
            <h1 className="text-2xl font-semibold mb-6">Settings</h1>

            {/* Tab navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`py-4 px-1 font-medium text-sm ${
                      activeTab === tab
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Profile content */}
            <div className="max-w-3xl">
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Profile</h2>
              </div>

              {/* Profile Photo */}
              <div className="flex items-center mb-6">
                <div className="w-28">
                  <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                </div>
                <div className="flex items-center space-x-4">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="Profile"
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <button className="text-gray-500 text-sm hover:text-gray-700">Remove</button>
                  <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">Update</button>
                </div>
              </div>

              {/* First & Last Name */}
              <div className="flex mb-6">
                <div className="w-28">
                  <label className="block text-sm font-medium text-gray-700">First & Last Name</label>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <input type="text" value="Martin" className="rounded-md border border-gray-300 px-3 py-2 text-sm" />
                  <input type="text" value="Janiter" className="rounded-md border border-gray-300 px-3 py-2 text-sm" />
                </div>
              </div>

              {/* Email Address */}
              <div className="flex mb-6">
                <div className="w-28">
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                </div>
                <div className="flex-1">
                  <input
                    type="email"
                    value="martin@gmail.com"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="flex mb-6">
                <div className="w-28">
                  <label className="block text-sm font-medium text-gray-700">Write Your Bio</label>
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="Write about you"
                    rows={4}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  ></textarea>
                </div>
              </div>

              {/* Username */}
              <div className="flex mb-6">
                <div className="w-28">
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <p className="text-xs text-gray-500 mt-1">You can change it later</p>
                </div>
                <div className="flex-1">
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      rareblocks.co/user/
                    </span>
                    <input
                      type="text"
                      value="martin.janiter"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Website */}
              <div className="flex mb-6">
                <div className="w-28">
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                </div>
                <div className="flex-1">
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      https://
                    </span>
                    <input
                      type="text"
                      value="postcrafts.co"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Job Title */}
              <div className="flex mb-6">
                <div className="w-28">
                  <label className="block text-sm font-medium text-gray-700">Job Title</label>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value="Software Developer"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="rounded text-indigo-600" checked />
                      <span className="ml-2 text-sm text-gray-700">Show this on my profile</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Country */}
              <div className="flex mb-8">
                <div className="w-28">
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <select className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm appearance-none">
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Update button */}
              <div className="ml-28">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
