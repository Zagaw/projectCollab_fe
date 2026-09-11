import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import discussionApi from '../../api/discussionApi';
import projectApi from '../../api/projectApi';
import EmptyState from '../common/EmptyState';
import { PageHeader } from '../common/PageHeader';
import toast from 'react-hot-toast';

const DiscussionCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Get projectId from searchParams OR location state
  const projectId = searchParams.get('projectId') || location.state?.projectId;

  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  // Determine base path
  const pathname = window.location.pathname;
  const isLecturerRoute = pathname.includes('/lecturer');
  const isTeamLeaderRoute = pathname.includes('/teamleader');
  const basePath = isLecturerRoute ? '/lecturer' :
                   isTeamLeaderRoute ? '/teamleader' : '/student';

  useEffect(() => {
    if (projectId) {
      fetchProject();
    } else {
      toast.error('Project ID is required');
      // ✅ FIX: Navigate back to discussions with proper path
      navigate(`${basePath}/discussions`);
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await projectApi.getProjectById(projectId);
      setProject(response.data);
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Failed to load project');
      navigate(`${basePath}/discussions`);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await discussionApi.createDiscussion(projectId, formData);
      toast.success('Discussion created successfully!');
      // ✅ FIX: Navigate back to project details with discussions tab
      navigate(`${basePath}/projects/${projectId}?tab=discussions`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create discussion');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: Back button - go to project details discussions tab
  const handleCancel = () => {
    navigate(`${basePath}/projects/${projectId}?tab=discussions`);
  };

  if (!projectId) {
    return (
      <EmptyState
        title="Project required"
        description="Select a project first to start a discussion."
        actionText="Go to discussions"
        actionLink={`${basePath}/discussions`}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <button type="button" onClick={handleCancel} className="text-sm text-indigo-700 hover:text-indigo-800 mb-2">
          Back to project
        </button>
        <PageHeader
          title="Start a discussion"
          description={project ? project.title : 'Share a topic with the project.'}
        />
      </div>

      <form onSubmit={handleSubmit} className="surface p-5 sm:p-6 space-y-4">
        <div>
          <label className="label" htmlFor="discussion-title">Title</label>
          <input
            id="discussion-title"
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="field"
            placeholder="What would you like to discuss?"
          />
          <p className="mt-1 text-xs text-gray-500">
            Be specific so others can respond usefully.
          </p>
        </div>

        <div>
          <label className="label" htmlFor="discussion-content">Content</label>
          <textarea
            id="discussion-content"
            name="content"
            rows="8"
            required
            value={formData.content}
            onChange={handleChange}
            className="field resize-none"
            placeholder="Describe your topic in detail. Include any relevant context, questions, or proposals..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Provide enough detail to help others understand and respond.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating...' : 'Create discussion'}
          </button>
          <button type="button" onClick={handleCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiscussionCreate;
