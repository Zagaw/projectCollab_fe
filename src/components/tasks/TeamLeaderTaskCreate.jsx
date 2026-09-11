import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import taskApi from '../../api/taskApi';
import teamApi from '../../api/teamApi';
import milestoneApi from '../../api/milestoneApi';
import toast from 'react-hot-toast';
import { PageHeader } from '../common/PageHeader';
import { ListTodo } from 'lucide-react';

const TeamLeaderTaskCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get('teamId');
  const milestoneId = searchParams.get('milestoneId');

  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    deadline: '',
    teamId: teamId || '',
    assignedTo: '',
    milestoneId: milestoneId || ''
  });

  useEffect(() => {
    fetchMyTeams();
  }, []);

  useEffect(() => {
    if (formData.teamId) {
      fetchMilestones(formData.teamId);
      fetchTeamMembers(formData.teamId);
    }
  }, [formData.teamId]);

  const fetchMyTeams = async () => {
    try {
      const response = await teamApi.getMyTeams();
      setTeams(response.data);
      if (teamId) {
        setFormData(prev => ({ ...prev, teamId }));
      }
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

  const fetchTeamMembers = async (teamId) => {
    try {
      const response = await teamApi.getTeamById(teamId);
      const members = response.data.members || [];
      setTeamMembers(members.filter(m => m.status === 'ACTIVE'));
    } catch (error) {
      toast.error('Failed to load team members');
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
    
    if (!formData.teamId) {
      toast.error('Please select a team');
      return;
    }

    setLoading(true);
    try {
      const response = await taskApi.createTask({
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        assignedTo: formData.assignedTo || null,
        milestoneId: formData.milestoneId || null,
        projectId: teams.find(t => t.teamId === parseInt(formData.teamId))?.projectId
      });
      toast.success('Task created successfully!');
      navigate(`/teamleader/tasks/${response.data.taskId}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <PageHeader
        icon={ListTodo}
        title="Create task"
        description="Assign work to someone on your team."
        actions={<button type="button" onClick={() => navigate('/teamleader/tasks')} className="btn-secondary">Cancel</button>}
      />
      <form onSubmit={handleSubmit} className="surface p-5 sm:p-6 mt-5 space-y-5">
        <div className="space-y-6">
          {/* Team */}
          <div>
            <label className="label">
              Team *
            </label>
            <select
              name="teamId"
              value={formData.teamId}
              onChange={handleChange}
              className="field"
              required
              disabled={!!teamId}
            >
              <option value="">Select a team</option>
              {teams.map((team) => (
                <option key={team.teamId} value={team.teamId}>
                  {team.name} - {team.projectTitle}
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

          {/* Status & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Assign To
              </label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="field"
              >
                <option value="">Unassigned</option>
                {teamMembers.map((member) => (
                  <option key={member.userId} value={member.userId}>
                    {member.fullName} ({member.email})
                  </option>
                ))}
              </select>
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
            <button type="button" onClick={() => navigate('/teamleader/tasks')} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TeamLeaderTaskCreate;