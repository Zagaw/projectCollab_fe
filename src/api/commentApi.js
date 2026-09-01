import api from './axios';

const commentApi = {
  // ============ TASK COMMENTS ============
  
  // Add comment to task (with files)
  addCommentToTask: (taskId, formData) => {
    return api.post(`/tasks/${taskId}/comments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get comments for task
  getCommentsForTask: (taskId) => {
    return api.get(`/tasks/${taskId}/comments`);
  },

  // ============ PROJECT COMMENTS ============
  
  // Add comment to project (with files)
  addCommentToProject: (projectId, formData) => {
    return api.post(`/projects/${projectId}/comments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get comments for project
  getCommentsForProject: (projectId) => {
    return api.get(`/projects/${projectId}/comments`);
  },

  // ============ COMMENT CRUD ============
  
  // Get comment by ID
  getCommentById: (commentId) => {
    return api.get(`/comments/${commentId}`);
  },

  // Get replies for a comment
  getRepliesForComment: (commentId) => {
    return api.get(`/comments/${commentId}/replies`);
  },

  // Get files for a comment
  getFilesForComment: (commentId) => {
    return api.get(`/comments/${commentId}/files`);
  },

  // Update comment
  updateComment: (commentId, data) => {
    return api.put(`/comments/${commentId}`, data);
  },

  // Soft delete comment
  deleteComment: (commentId) => {
    return api.delete(`/comments/${commentId}`);
  },

  // Hard delete comment (admin only)
  hardDeleteComment: (commentId) => {
    return api.delete(`/comments/${commentId}/hard`);
  },

  // Delete file from comment
  deleteFileFromComment: (fileId) => {
    return api.delete(`/comments/files/${fileId}`);
  },
};

export default commentApi;