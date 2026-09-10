import api from './axios';

const meetingApi = {
  createMeeting: (teamId, data) => {
    return api.post(`/teams/${teamId}/meetings`, data);
  },

  getTeamMeetings: (teamId, filter = 'all') => {
    return api.get(`/teams/${teamId}/meetings`, { params: { filter } });
  },

  getMyMeetings: (filter = 'all') => {
    return api.get('/meetings/my', { params: { filter } });
  },

  getLecturerMeetings: (filter = 'all') => {
    return api.get('/meetings/lecturer', { params: { filter } });
  },

  getMeetingById: (meetingId) => {
    return api.get(`/meetings/${meetingId}`);
  },

  updateMeeting: (meetingId, data) => {
    return api.put(`/meetings/${meetingId}`, data);
  },

  cancelMeeting: (meetingId) => {
    return api.patch(`/meetings/${meetingId}/cancel`);
  },

  saveMinutes: (meetingId, minutes) => {
    return api.patch(`/meetings/${meetingId}/minutes`, { minutes });
  },

  rsvp: (meetingId, response) => {
    return api.post(`/meetings/${meetingId}/rsvp`, { response });
  },
};

export default meetingApi;
