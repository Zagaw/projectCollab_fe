import api from './axios';

const reportApi = {
  getReport: ({ type, projectId, teamId, from, to }) => {
    const params = { type };
    if (projectId) params.projectId = projectId;
    if (teamId) params.teamId = teamId;
    if (from) params.from = from;
    if (to) params.to = to;
    return api.get('/reports', { params });
  },
};

export default reportApi;
