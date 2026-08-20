import api from './axios';

const teamApi = {
  // Create a new team
  createTeam: (teamData) => {
    return api.post('/teams', teamData);
  },

  // Get team by ID
  getTeamById: (teamId) => {
    return api.get(`/teams/${teamId}`);
  },

  // Get teams by project
  getTeamsByProject: (projectId) => {
    return api.get(`/teams/project/${projectId}`);
  },

  // Get my teams
  getMyTeams: () => {
    return api.get('/teams/my-teams');
  },

  // Update team
  updateTeam: (teamId, teamData) => {
    return api.put(`/teams/${teamId}`, teamData);
  },

  // Delete team
  deleteTeam: (teamId) => {
    return api.delete(`/teams/${teamId}`);
  },

  // Assign team leader
  assignTeamLeader: (teamId, userId) => {
    return api.post(`/teams/${teamId}/assign-leader/${userId}`);
  }
};

export default teamApi;