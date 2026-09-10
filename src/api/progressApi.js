import api from './axios';

const progressApi = {
  getTeamProgress: (teamId) => api.get(`/teams/${teamId}/progress`),
  getProjectProgress: (projectId) => api.get(`/projects/${projectId}/progress`),
  getMyProgress: () => api.get('/progress/my'),
  getLecturerProgress: () => api.get('/progress/lecturer'),
};

export default progressApi;
