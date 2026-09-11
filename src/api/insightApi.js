import api from './axios';

const insightApi = {
  getMine: () => api.get('/insights/me'),
  getLecturer: () => api.get('/insights/lecturer'),
  getTeam: (teamId) => api.get(`/insights/teams/${teamId}`),
  summarizeTeam: (teamId) => api.post(`/insights/teams/${teamId}/summary`),
  scan: () => api.post('/insights/scan'),
};

export default insightApi;
