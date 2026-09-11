import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import notificationApi from '../../api/notificationApi';
import toast from 'react-hot-toast';

const POLL_MS = 30000;

const roleBasePath = (role) => {
  if (role === 'LECTURER') return '/lecturer';
  if (role === 'TEAM_LEADER') return '/teamleader';
  if (role === 'ADMIN') return '/admin';
  return '/student';
};

export const notificationLink = (notification, role) => {
  const basePath = roleBasePath(role);
  const type = notification.entityType;
  const id = notification.entityId;
  const projectId = notification.projectId;

  if (basePath === '/admin') {
    return '/admin/projects';
  }
  if (notification.type === 'TEAM_AT_RISK' && id) {
    return `${basePath}/insights?teamId=${id}`;
  }
  if (type === 'TASK' && id) return `${basePath}/tasks/${id}`;
  if (type === 'MILESTONE' && id) return `${basePath}/milestones/${id}`;
  if (type === 'TEAM' && id) return `${basePath}/teams/${id}`;
  if (type === 'MEETING' && id) return `${basePath}/meetings/${id}`;
  if (type === 'DISCUSSION' && id) {
    return `${basePath}/discussions/${id}${projectId ? `?projectId=${projectId}` : ''}`;
  }
  if (projectId) return `${basePath}/projects/${projectId}`;
  return `${basePath}/dashboard`;
};

const formatTime = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleString();
};

const NotificationBell = ({ tone = 'light' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const dropdownRef = useRef(null);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      setUnreadCount(response.data?.unreadCount || 0);
    } catch (error) {
      // Keep the last known count if a poll fails.
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoadingList(true);
      const response = await notificationApi.getNotifications(false);
      setNotifications(response.data || []);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, POLL_MS);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  useEffect(() => {
    const handleClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleToggle = async () => {
    const next = !open;
    setOpen(next);
    if (next) {
      await fetchNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true, read: true })));
    } catch (error) {
      toast.error('Failed to mark notifications as read');
    }
  };

  const handleClickNotification = async (notification) => {
    try {
      if (!(notification.isRead || notification.read)) {
        await notificationApi.markRead(notification.notificationId);
        setUnreadCount((count) => Math.max(0, count - 1));
        setNotifications((prev) =>
          prev.map((item) =>
            item.notificationId === notification.notificationId ? { ...item, isRead: true, read: true } : item
          )
        );
      }
    } catch (error) {
      // Still navigate even if mark-read fails.
    }
    setOpen(false);
    navigate(notificationLink(notification, user?.role));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={`relative p-2 rounded-lg transition ${
          tone === 'ink'
            ? 'text-white/80 hover:bg-white/10 hover:text-white'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
        title="Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-4 px-1 bg-red-600 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs text-indigo-600 hover:text-indigo-700"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loadingList ? (
              <p className="p-4 text-sm text-gray-500">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">No notifications yet.</p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.notificationId}
                  type="button"
                  onClick={() => handleClickNotification(notification)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 ${
                    notification.isRead || notification.read ? 'bg-white' : 'bg-indigo-50/60'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatTime(notification.createdAt)}</p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
