import api from './axios';

const projectApi = {
  // Create a new project
  createProject: (projectData) => {
    return api.post('/projects', projectData);
  },

  // Get all projects for the current lecturer
  getMyProjects: () => {
    return api.get('/projects/my-projects');
  },

  // Get project by ID
  getProjectById: (projectId) => {
    return api.get(`/projects/${projectId}`);
  },

  // Update project
  updateProject: (projectId, projectData) => {
    return api.put(`/projects/${projectId}`, projectData);
  },

  // Delete project
  deleteProject: (projectId) => {
    return api.delete(`/projects/${projectId}`);
  },

  // Update project status
  updateProjectStatus: (projectId, status) => {
    return api.patch(`/projects/${projectId}/status`, status);
  },

  // Get overdue projects
  getOverdueProjects: () => {
    return api.get('/projects/overdue');
  },

  // Get all projects (admin only)
  getAllProjects: () => {
    return api.get('/projects/all');
  }
};

export default projectApi;