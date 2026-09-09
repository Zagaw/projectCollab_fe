import api from './axios';

const milestoneApi = {
  // Create a new milestone
  createMilestone: (milestoneData) => {
    return api.post('/milestones', milestoneData);
  },

  // Get milestone by ID
  getMilestoneById: (milestoneId) => {
    return api.get(`/milestones/${milestoneId}`);
  },

  // Get all milestones for a team
  getMilestonesByTeam: (teamId) => {
    return api.get(`/milestones/team/${teamId}`);
  },

  // Get my team milestones (Team Leader only)
  getMyTeamMilestones: () => {
    return api.get('/milestones/my-team-milestones');
  },

  getLecturerMilestones: () => {
    return api.get('/milestones/lecturer');
  },

  // Get incomplete milestones for a team
  getIncompleteMilestones: (teamId) => {
    return api.get(`/milestones/team/${teamId}/incomplete`);
  },

  // Get overdue milestones for a team
  getOverdueMilestones: (teamId) => {
    return api.get(`/milestones/team/${teamId}/overdue`);
  },

  // Update milestone
  updateMilestone: (milestoneId, milestoneData) => {
    return api.put(`/milestones/${milestoneId}`, milestoneData);
  },

  // Update milestone status (complete/uncomplete)
  updateMilestoneStatus: (milestoneId, isCompleted) => {
    return api.patch(`/milestones/${milestoneId}/status`, { isCompleted });
  },

  // Delete milestone
  deleteMilestone: (milestoneId) => {
    return api.delete(`/milestones/${milestoneId}`);
  },

  // Get milestone statistics
  getMilestoneStatistics: (teamId) => {
    return api.get(`/milestones/team/${teamId}/statistics`);
  }
};

export default milestoneApi;