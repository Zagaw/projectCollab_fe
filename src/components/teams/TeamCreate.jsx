import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import teamApi from '../../api/teamApi';
import projectApi from '../../api/projectApi';
import toast from 'react-hot-toast';
import { PageHeader } from '../common/PageHeader';
import { Users } from 'lucide-react';

const TeamCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    projectId: projectId || ''
  });

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId]);

  const fetchProject = async (id) => {
    try {
      const response = await projectApi.getProjectById(id);
      setProject(response.data);
      setFormData(prev => ({ ...prev, projectId: id }));
    } catch (error) {
      toast.error('Failed to load project');
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
      const response = await teamApi.createTeam(formData);
      toast.success('Team created successfully!');
      navigate(`/lecturer/teams/${response.data.teamId}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  const backTo = projectId ? `/lecturer/projects/${projectId}` : '/teams';

  return (
    <div className="max-w-3xl">
      <PageHeader
        icon={Users}
        title="Create team"
        description={project ? `For project: ${project.title}` : 'Add a team to your project.'}
        actions={
          <button type="button" onClick={() => navigate(backTo)} className="btn-secondary">
            Cancel
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="surface p-5 sm:p-6 mt-5 space-y-5">
        <div className="space-y-6">
          {!projectId && (
            <div>
              <label className="label">Project *</label>
              <input
                type="text"
                name="projectId"
                required
                value={formData.projectId}
                onChange={handleChange}
                className="field"
                placeholder="Enter project ID"
              />
            </div>
          )}

          <div>
            <label className="label">Team name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="field"
              placeholder="e.g., Team Alpha"
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="field"
              placeholder="Describe the team's purpose and responsibilities"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Creating...' : 'Create team'}
            </button>
            <button
              type="button"
              onClick={() => navigate(backTo)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TeamCreate;
