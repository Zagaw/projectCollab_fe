import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import teamApi from '../../api/teamApi';
import projectApi from '../../api/projectApi';
import toast from 'react-hot-toast';

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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(projectId ? `/lecturer/projects/${projectId}` : '/teams')}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Team</h1>
          <p className="text-gray-600">
            {project ? `For project: ${project.title}` : 'Add a team to your project'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-6">
          {/* Project Selection */}
          {!projectId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project *
              </label>
              <input
                type="text"
                name="projectId"
                required
                value={formData.projectId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
                placeholder="Enter Project ID"
              />
            </div>
          )}

          {/* Team Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
              placeholder="e.g., Team Alpha"
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
              placeholder="Describe the team's purpose and responsibilities"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Team'}
            </button>
            <button
              type="button"
              onClick={() => navigate(projectId ? `/lecturer/projects/${projectId}` : '/teams')}
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

export default TeamCreate;