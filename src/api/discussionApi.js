import api from './axios';

const discussionApi = {
  // ============ DISCUSSIONS ============
  
  // Create a new discussion
  createDiscussion: (projectId, data) => {
    return api.post(`/projects/${projectId}/discussions`, data);
  },

  // Get all discussions for a project
  getDiscussions: (projectId) => {
    return api.get(`/projects/${projectId}/discussions`);
  },

  // Get discussion by ID
  getDiscussionById: (projectId, discussionId) => {
    return api.get(`/projects/${projectId}/discussions/${discussionId}`);
  },

  // Delete discussion
  deleteDiscussion: (projectId, discussionId) => {
    return api.delete(`/projects/${projectId}/discussions/${discussionId}`);
  },

  // ============ DISCUSSION REPLIES ============
  
  // Add reply to discussion
  addReply: (projectId, discussionId, content) => {
    return api.post(`/projects/${projectId}/discussions/${discussionId}/replies`, content, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  },
};

export default discussionApi;