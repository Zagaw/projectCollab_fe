import api from './axios';

const taskApi = {
  // Create a new task
  createTask: (taskData) => {
    return api.post('/tasks', taskData);
  },

  // Get task by ID
  getTaskById: (taskId) => {
    return api.get(`/tasks/${taskId}`);
  },

  // Get tasks by project
  getTasksByProject: (projectId) => {
    return api.get(`/tasks/project/${projectId}`);
  },

  // Get tasks by team
  getTasksByTeam: (teamId) => {
    return api.get(`/tasks/team/${teamId}`);
  },

  // Get tasks assigned to current user
  getMyTasks: () => {
    return api.get('/tasks/my-tasks');
  },

  // Get tasks assigned to a specific student
  getTasksByStudent: (studentId) => {
    return api.get(`/tasks/student/${studentId}`);
  },

  // Get tasks by milestone
  getTasksByMilestone: (milestoneId) => {
    return api.get(`/tasks/milestone/${milestoneId}`);
  },

  // Get my overdue tasks
  getOverdueTasks: () => {
    return api.get('/tasks/overdue');
  },

  // Get task summary by project
  getTaskSummary: (projectId) => {
    return api.get(`/tasks/project/${projectId}/summary`);
  },

  // Update task
  updateTask: (taskId, taskData) => {
    return api.put(`/tasks/${taskId}`, taskData);
  },

  // Update task status
  updateTaskStatus: (taskId, status) => {
    return api.patch(`/tasks/${taskId}/status`, { status });
  },

  // Delete task
  deleteTask: (taskId) => {
    return api.delete(`/tasks/${taskId}`);
  }
};

export default taskApi;