import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import taskApi from '../../api/taskApi';
import projectApi from '../../api/projectApi';
import teamApi from '../../api/teamApi';
import milestoneApi from '../../api/milestoneApi';
import toast from 'react-hot-toast';

const TaskCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const teamId = searchParams.get('teamId');
  const milestoneId = searchParams.get('milestoneId');

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [students, setStudents] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    deadline: '',
    projectId: projectId || '',
    teamId: teamId || '',
    assignedTo: '',
    milestoneId: milestoneId || ''
  });

  useEffect(() => {
    fetchProjects();
    if (formData.projectId) fetchTeams(formData.projectId);
    if (formData.teamId) fetchMilestones(formData.teamId);
  }, []);

  useEffect(() => {
    if (formData.projectId) {
      fetchTeams(formData.projectId);
    }
  }, [formData.projectId]);

  useEffect(() => {
    if (formData.teamId) {
      fetchMilestones(formData.teamId);
    }
  }, [formData.teamId]);

  const fetchProjects = async () => {
    try {
      const response = await projectApi.getMyProjects();
      setProjects(response.data);
    } catch (error) {
      toast.error('Failed to load projects');
    }
  };

  const fetchTeams = async (projectId) => {
    try {
      const response = await teamApi.getTeamsByProject(projectId);
      setTeams(response.data);
    } catch (error) {
      toast.error('Failed to load teams');
    }
  };

  const fetchMilestones = async (teamId) => {
    try {
      const response = await milestoneApi.getMilestonesByTeam(teamId);
      setMilestones(response.data);
    } catch (error) {
      toast.error('Failed to load milestones');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.projectId) {
      toast.error('Please select a project');
      return;
    }

    setLoading(true);
    try {
      const response = await taskApi.createTask({
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        assignedTo: formData.assignedTo || null,
        milestoneId: formData.milestoneId || null,
        teamId: formData.teamId || null
      });
      toast.success('Task created successfully!');
      navigate(`/tasks/${response.data.taskId}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
          <p className="text-gray-600">Add a task to track work progress</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-6">
          {/* Project */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project *
            </label>
            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
              required
              disabled={!!projectId}
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.projectId} value={project.projectId}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
              placeholder="Enter task title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
              placeholder="Describe the task"
            />
          </div>

          {/* Team, Status, Priority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team
              </label>
              <select
                name="teamId"
                value={formData.teamId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
                disabled={!!teamId}
              >
                <option value="">Select a team</option>
                {teams.map((team) => (
                  <option key={team.teamId} value={team.teamId}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">In Review</option>
                <option value="BLOCKED">Blocked</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          {/* Deadline & Assigned To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign To (Student ID)
              </label>
              <input
                type="number"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
                placeholder="Enter student ID"
              />
            </div>
          </div>

          {/* Milestone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Milestone (Optional)
            </label>
            <select
              name="milestoneId"
              value={formData.milestoneId}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
              disabled={!!milestoneId}
            >
              <option value="">No milestone</option>
              {milestones.map((milestone) => (
                <option key={milestone.milestoneId} value={milestone.milestoneId}>
                  {milestone.title} {milestone.isCompleted ? '✅' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskCreate;