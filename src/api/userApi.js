import api from './axios';

const userApi = {
  // Get current user profile
  getCurrentUser: () => {
    return api.get('/users/me');
  },

  // Update user profile
  updateProfile: (userData) => {
    return api.put('/users/me', userData);
  },

  // Update password
  updatePassword: (passwordData) => {
    return api.patch('/users/me/password', passwordData);
  },

  // ✅ NEW: Get available users for invitation
  getAvailableUsers: () => {
    return api.get('/users/available');
  }
};

export default userApi;