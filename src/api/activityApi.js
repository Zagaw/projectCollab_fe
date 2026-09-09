import api from './axios';

const activityApi = {
  getProjectActivities: (projectId, limit = 50) => {
    return api.get(`/projects/${projectId}/activities`, { params: { limit } });
  },

  getMyActivities: (limit = 10) => {
    return api.get('/users/me/activities', { params: { limit } });
  },
};

export default activityApi;
