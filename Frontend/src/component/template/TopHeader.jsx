import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, Settings, LogOut, Bell, ChevronDown, X, Check } from 'lucide-react';
import { authService } from '../../services/AuthService';
import userProfileHandleService from '../../services/userProfileHandleService';
import axios from 'axios';

// Notification Popup Modal Component
const NotificationModal = ({ notification, isOpen, onClose, onMarkAsRead }) => {
  if (!isOpen || !notification) return null;

  const handleMarkAsRead = () => {
    if (notification.status === 'UNREAD') {
      onMarkAsRead(notification.id);
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed  inset-0 flex items-center justify-center z-[9999]"
      onClick={handleBackdropClick}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className=" bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2 mt-2">{notification.title}</h3>
          <button onClick={onClose} className=" bg-blue-600 p-1 rounded-full cursor-pointer hover:bg-blue-800">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto">
          <div className="mb-4">
            <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{notification.message}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          {notification.status === 'UNREAD' && (
            <button
              onClick={handleMarkAsRead}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Check className="h-4 w-4 mr-2" />
              Mark as Read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const NotificationDropdown = ({ notifications, onMarkAsRead, onClose, onViewAll, onNotificationClick }) => {
  // Show only up to 5 unread notifications
  const unreadNotifications = notifications.filter((n) => n.status === 'UNREAD').slice(0, 5);

  // Prevent clicks inside from closing the dropdown
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={stopPropagation}
      className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {unreadNotifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No new notifications</div>
        ) : (
          unreadNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                notification.status === 'UNREAD' ? 'bg-blue-50' : 'opacity-60'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 cursor-pointer" onClick={() => onNotificationClick(notification)}>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{notification.title}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2">{notification.message}</p>
                </div>
                {notification.status === 'UNREAD' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(notification.id);
                    }}
                    className="ml-2 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                    title="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-gray-200">
        <button
          onClick={onViewAll}
          className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View All Notifications
        </button>
      </div>
    </div>
  );
};

export default function TopHeader({ HeaderMessage, handleGetUserDetails }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [profileDetails, setProfileDetails] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();

  // Fetch profile details and notifications on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user?.user_id && user?.token) {
      // Fetch profile
      userProfileHandleService
        .findUserProfileById(user.user_id)
        .then((response) => {
          setProfileDetails(response.data);
          handleGetUserDetails(response.data);
        })
        .catch((err) => {
          console.error('Error fetching profile details:', err);
        });

      // Fetch notifications
      fetchNotifications(user.user_id);
    }
  }, []);

  // Global click listener to close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowProfileDropdown(false);
      setShowNotificationDropdown(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const fetchNotifications = async (userId) => {
    try {
      const response = await axios.get(`http://www.localhost:8080/api/v2/notification/${userId}`);
      if (response.status === 200) {
        setNotifications(response.data);
        const unread = response.data.filter((n) => n.status === 'UNREAD').length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.put(`http://www.localhost:8080/api/v2/notification/${notificationId}`, {
        status: 'READ',
      });
      if (response.status === 200) {
        // After marking as read, re-fetch notifications for updated list & count
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.user_id) {
          fetchNotifications(user.user_id);
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const toggleDropdown = (setter, currentState, e) => {
    e.stopPropagation();
    setter(!currentState);
  };

  const handleViewAllNotifications = () => {
    setShowNotificationDropdown(false);
    navigate('/notifications');
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowNotificationModal(true);
    setShowNotificationDropdown(false); // Close dropdown when modal opens
  };

  const handleCloseNotificationModal = () => {
    setShowNotificationModal(false);
    setSelectedNotification(null);
  };

  const handleMarkAsReadFromModal = async (notificationId) => {
    await markAsRead(notificationId);
    // Update the selected notification status locally for immediate UI update
    setSelectedNotification((prev) => (prev ? { ...prev, status: 'READ' } : null));
  };

  return (
    <>
      <header className="bg-white p-1 shadow-sm z-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl pl-5 font-bold text-gray-800">{HeaderMessage}</h1>
          </div>

          <div className="flex items-center mt-4 md:mt-0 space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={(e) => toggleDropdown(setShowNotificationDropdown, showNotificationDropdown, e)}
                className="relative p-2 text-gray-500 hover:text-gray-700 hover:scale-110 cursor-pointer transition-transform duration-200 rounded-lg"
              >
                <Bell size={20} className="" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 ring-2 ring-blue-200 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              {showNotificationDropdown && (
                <NotificationDropdown
                  notifications={notifications}
                  onMarkAsRead={markAsRead}
                  onClose={() => setShowNotificationDropdown(false)}
                  onViewAll={handleViewAllNotifications}
                  onNotificationClick={handleNotificationClick}
                />
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2 border border-transparent rounded-lg px-3 py-2 cursor-pointer transition-colors duration-200 bg-white"
                onClick={(e) => toggleDropdown(setShowProfileDropdown, showProfileDropdown, e)}
              >
                <img
                  src={profileDetails?.profile_image || ''}
                  alt="Profile"
                  className="h-10 w-10 object-cover rounded-full"
                />
                <div className="flex flex-col justify-center ml-2">
                  <span className="text-sm font-medium hidden md:inline">{profileDetails?.username || ''}</span>
                  <span style={{ fontSize: '0.7em' }} className="font-medium hidden md:inline text-gray-800">
                    {profileDetails?.role || 'Student'}
                  </span>
                </div>
                <ChevronDown size={14} className="text-gray-500" />
              </button>

              {showProfileDropdown && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                >
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-semibold">{profileDetails?.username}</p>
                    <p className="text-xs text-gray-500">{profileDetails?.email}</p>
                  </div>
                  <ul className="py-1">
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-gray-700">
                      <Home size={17} className="text-gray-500" />
                      <Link to="/"><span className="text-m">Home</span></Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-gray-700">
                      <User size={17} className="text-gray-500" />
                      <Link to="/settings/profile"><span className="text-m">Profile</span></Link>
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

      {/* Notification Modal */}
      <NotificationModal
        notification={selectedNotification}
        isOpen={showNotificationModal}
        onClose={handleCloseNotificationModal}
        onMarkAsRead={handleMarkAsReadFromModal}
      />
    </>
  );
}
