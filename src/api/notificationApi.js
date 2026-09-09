import api from './axios';

const notificationApi = {
  getNotifications: (unreadOnly = false) => {
    return api.get('/notifications', { params: { unreadOnly } });
  },

  getUnreadCount: () => {
    return api.get('/notifications/unread-count');
  },

  markRead: (id) => {
    return api.patch(`/notifications/${id}/read`);
  },

  markAllRead: () => {
    return api.patch('/notifications/read-all');
  },
};

export default notificationApi;
