import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import milestoneApi from '../../api/milestoneApi';
import teamApi from '../../api/teamApi';
import toast from 'react-hot-toast';
import { PageHeader } from '../common/PageHeader';

const MilestoneCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get('teamId');

  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    teamId: teamId || ''
  });

  useEffect(() => {
    if (!teamId) {
      fetchMyTeams();
    }
  }, [teamId]);

  const fetchMyTeams = async () => {
    try {
      const response = await teamApi.getMyTeams();
      setTeams(response.data);
    } catch (error) {
      toast.error('Failed to load teams');
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
      const response = await milestoneApi.createMilestone({
        ...formData,
        deadline: new Date(formData.deadline).toISOString()
      });
      toast.success('Milestone created successfully!');
      navigate(`/milestones/${response.data.milestoneId}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create milestone');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Create milestone"
        description="Set a milestone for your team to achieve."
        actions={<button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>}
      />
      <form onSubmit={handleSubmit} className="surface p-5 sm:p-6 mt-5 space-y-5">
        {!teamId && (
          <div>
            <label className="label" htmlFor="milestone-team">Team *</label>
            <select
              id="milestone-team"
              name="teamId"
              value={formData.teamId}
              onChange={handleChange}
              className="field"
              required
            >
              <option value="">Select a team</option>
              {teams.map((team) => (
                <option key={team.teamId} value={team.teamId}>
                  {team.name} - {team.projectTitle}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="label" htmlFor="milestone-title">Milestone title *</label>
          <input
            id="milestone-title"
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="field"
            placeholder="e.g., Complete Sprint 1"
          />
        </div>

        <div>
          <label className="label" htmlFor="milestone-description">Description</label>
          <textarea
            id="milestone-description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="field"
            placeholder="Describe what this milestone aims to achieve"
          />
        </div>

        <div>
          <label className="label" htmlFor="milestone-deadline">Deadline *</label>
          <input
            id="milestone-deadline"
            type="date"
            name="deadline"
            required
            value={formData.deadline}
            onChange={handleChange}
            className="field"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Creating...' : 'Create milestone'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default MilestoneCreate;
