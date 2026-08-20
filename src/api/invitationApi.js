import api from './axios';

const invitationApi = {
  // Invite student to team
  inviteStudent: (inviteData) => {
    return api.post('/invitations', inviteData);
  },

  // Accept invitation
  acceptInvitation: (invitationId) => {
    return api.post(`/invitations/${invitationId}/accept`);
  },

  // Reject invitation
  rejectInvitation: (invitationId) => {
    return api.post(`/invitations/${invitationId}/reject`);
  },

  // Get my pending invitations
  getMyInvitations: () => {
    return api.get('/invitations/my-invitations');
  },

  // Get my active teams
  getMyActiveTeams: () => {
    return api.get('/invitations/my-teams');
  },

  // Remove member from team
  removeMember: (teamId, memberId) => {
    return api.delete(`/invitations/${teamId}/members/${memberId}`);
  }
};

export default invitationApi;