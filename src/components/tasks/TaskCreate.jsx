import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import taskApi from '../../api/taskApi';
import projectApi from '../../api/projectApi';
import teamApi from '../../api/teamApi';
import milestoneApi from '../../api/milestoneApi';
import toast from 'react-hot-toast';
import { PageHeader } from '../common/PageHeader';

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
      navigate(`/lecturer/tasks/${response.data.taskId}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Create task"
        description="Add a task to a project team."
        actions={<button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>}
      />
      <form onSubmit={handleSubmit} className="surface p-5 sm:p-6 mt-5 space-y-5">
        <div className="space-y-6">
          {/* Project */}
          <div>
            <label className="label">
              Project *
            </label>
            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className="field"
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
            <label className="label">
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="field"
              placeholder="Enter task title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="label">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="field"
              placeholder="Describe the task"
            />
          </div>

          {/* Team, Status, Priority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">
                Team
              </label>
              <select
                name="teamId"
                value={formData.teamId}
                onChange={handleChange}
                className="field"
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
              <label className="label">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="field"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">In Review</option>
                <option value="BLOCKED">Blocked</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label className="label">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="field"
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
              <label className="label">
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="field"
              />
            </div>

            <div>
              <label className="label">
                Assign To (Student ID)
              </label>
              <input
                type="number"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="field"
                placeholder="Enter student ID"
              />
            </div>
          </div>

          {/* Milestone */}
          <div>
            <label className="label">
              Milestone (Optional)
            </label>
            <select
              name="milestoneId"
              value={formData.milestoneId}
              onChange={handleChange}
              className="field"
              disabled={!!milestoneId}
            >
              <option value="">No milestone</option>
              {milestones.map((milestone) => (
                <option key={milestone.milestoneId} value={milestone.milestoneId}>
                  {milestone.title}{milestone.isCompleted ? ' (done)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Creating...' : 'Create task'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskCreate;