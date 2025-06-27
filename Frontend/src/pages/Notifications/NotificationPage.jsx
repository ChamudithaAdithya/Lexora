import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle, Clock, Trash2, X, Eye, CornerLeftUpIcon, Check, ArrowRight } from 'lucide-react';
import axios from 'axios';
import SidebarSub from '../../component/template/SidebarSub';
import TopHeader from '../../component/template/TopHeader';
import Alert from '../../component/template/alert/Alert';
import { useNavigate } from 'react-router';

// Notification Detail Modal Component
const NotificationDetailModal = ({ notification, isOpen, onClose, onMarkAsRead, onDelete }) => {
  if (!isOpen || !notification) return null;

  const handleMarkAsRead = () => {
    if (notification.status === 'UNREAD') {
      onMarkAsRead(notification.id);
    }
  };

  const handleDelete = () => {
    const confirmed = confirm('Are you sure you want to delete this notification?');
    if (confirmed) {
      onDelete(notification.id);
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      onClick={handleBackdropClick}
    >
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Modal Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Notification Details</h3>
              <p className="text-sm text-gray-600 mt-2">
                <Clock className="h-4 w-4 inline mr-2" />
                {formatDateTime(notification.created_at || new Date().toISOString())}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="space-y-6">
            {/* Notification Status */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-semibold text-gray-900">{notification.title}</h4>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{notification.message}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-center space-x-4">
                {notification.status === 'UNREAD' && (
                  <button
                    onClick={handleMarkAsRead}
                    className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const navigate = useNavigate();

  const deleteAllNotifications = async () => {
    const confirmed = confirm('Are you sure you want to delete all notifications?');
    if (confirmed) {
      try {
        notifications.forEach((notification) => {
          deleteNotification(notification.id);
          window.location.reload();
          setAlertMessage('All notifications deleted successfully');
          setAlertType('success');
        });
      } catch (error) {
        setAlertMessage('Failed to delete all notifications');
        setAlertType('error');
        console.error('Error deleting all notifications:', error);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.user_id) {
        const response = await axios.get(`http://www.localhost:8080/api/v2/notification/${user.user_id}`);
        if (response.status === 200) {
          setNotifications(response.data);
        }
      }
    } catch (error) {
      setAlertMessage('Failed to fetch notifications');
      setAlertType('error');
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewNotification = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.put(`http://www.localhost:8080/api/v2/notification/${notificationId}`, {
        status: 'READ',
      });
      if (response.status === 200) {
        fetchNotifications(); // Refresh the list
        setAlertMessage('Notification marked as read');
        setAlertType('success');
      }
    } catch (error) {
      setAlertMessage('Failed to mark notification as read');
      setAlertType('error');
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await axios.delete(`http://www.localhost:8080/api/v2/notification/${notificationId}`);
      if (response.status === 200) {
        fetchNotifications(); // Refresh the list
        setAlertMessage('Notification deleted successfully');
        setAlertType('success');
      }
    } catch (error) {
      setAlertMessage('Failed to delete notification');
      setAlertType('error');
      console.error('Error deleting notification:', error);
    }
  };

  const markAllAsRead = async () => {
    const confirmed = confirm('Are you sure you want to mark all notifications as read?');
    if (confirmed) {
      try {
        const unreadNotifications = notifications.filter((n) => n.status === 'UNREAD');
        const promises = unreadNotifications.map((n) =>
          axios.put(`http://www.localhost:8080/api/v2/notification/${n.id}`, { status: 'READ' })
        );

        await Promise.all(promises);
        fetchNotifications();
        setAlertMessage('All notifications marked as read');
        setAlertType('success');
      } catch (error) {
        setAlertMessage('Failed to mark all notifications as read');
        setAlertType('error');
        console.error('Error marking all notifications as read:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    return status === 'UNREAD' ? (
      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Unread</span>
    ) : (
      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Read</span>
    );
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return notification.status === 'UNREAD';
    if (filter === 'read') return notification.status === 'READ';
    return true;
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

  const unreadCount = notifications.filter((n) => n.status === 'UNREAD').length;

  return (
    <>
      {alertMessage && <Alert message={alertMessage} type={alertType} />}
      <div className="flex h-screen overflow-hidden bg-white">
        <SidebarSub />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <TopHeader HeaderMessage={'Notifications'} />

          <div className="flex-1 flex m-5 flex-col pt-5 pl-10 overflow-auto">
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600">Manage your notifications and stay updated</p>
                  {unreadCount > 0 && (
                    <p className="text-sm text-blue-600 mt-1">
                      You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark All as Read
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="border-b border-gray-200 mb-6 mr-3">
              <nav className="flex space-x-8">
                {[
                  { key: 'all', label: 'All Notifications', count: notifications.length },
                  { key: 'unread', label: 'Unread', count: unreadCount },
                  { key: 'read', label: 'Read', count: notifications.filter((n) => n.status === 'READ').length },
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    className={`py-4 px-1 font-medium text-sm ${
                      filter === key ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setFilter(key)}
                  >
                    {label} ({count})
                  </button>
                ))}
              </nav>
            </div>

            {/* Notifications List */}
            <div className="bg-white shadow  sm:rounded-md overflow-auto mr-3">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications found</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {filteredNotifications.reverse().map((notification) => (
                    <li
                      key={notification.id}
                      className={`px-6 py-4 ${notification.status === 'UNREAD' ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start flex-1 min-w-0">
                          <div className="ml-4 flex-1 min-w-0">
                            <div className="flex items-center">
                              <p className="text- font-medium text-gray-900 truncate">{notification.title}</p>
                            </div>

                            <p className="mt-1 text-sm text-gray-600 ">{notification.message}</p>
                            {notification.title == 'MENTOR_SESSION_REQUEST' && (
                              <button
                                onClick={() => navigate(`../RequestedSessionsPage/0/${notification.recieverId}`)}
                                className="inline-flex mt-4 cursor-pointer mb-4 items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-2"
                              >
                                <ArrowRight className="h-4 w-4 mr-1" />
                                <p className="text- font-medium ">Take Action</p>
                              </button>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDateTime(notification.created_at || new Date().toISOString())}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {notification.status === 'UNREAD' && (
                            <button
                              onClick={() => {
                                markAsRead(notification.id);
                                handleMarkAsRead;
                              }}
                              className="inline-flex items-center p-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4 " />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              const confirmed = confirm('Are you sure you want to delete this notification?');
                              if (confirmed) deleteNotification(notification.id);
                            }}
                            className="inline-flex items-center p-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-500 hover:bg-red-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            title="Delete notification"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {notifications.length !== 0 && (
              <div className="flex justify-end mr-3">
                <button
                  onClick={() => {
                    deleteAllNotifications();
                  }}
                  className=" mt-5 inline-flex w-26 items-center p-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  title="Delete notification"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notification Detail Modal */}
        <NotificationDetailModal
          notification={selectedNotification}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onMarkAsRead={markAsRead}
          onDelete={deleteNotification}
        />
      </div>
    </>
  );
}
