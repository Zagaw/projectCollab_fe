import api from './axios';

const adminApi = {
  getAllUsers: () => api.get('/admin/users'),

  updateUserRole: (userId, role) =>
    api.put(`/admin/users/${userId}/role`, { role }),

  updateUserStatus: (userId, status) =>
    api.put(`/admin/users/${userId}/status`, { status }),

  getPendingLecturers: () => api.get('/admin/pending-lecturers'),

  verifyLecturer: (userId) => api.put(`/admin/verify-lecturer/${userId}`),

  rejectLecturer: (userId) => api.put(`/admin/reject-lecturer/${userId}`),
};

export default adminApi;
