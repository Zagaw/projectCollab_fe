import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import discussionApi from '../../api/discussionApi';
import projectApi from '../../api/projectApi';
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
      <div className="max-w-3xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900">Project ID Required</h2>
        <p className="text-gray-600 mt-2">Please select a project first to start a discussion.</p>
        <button
          onClick={() => navigate(`${basePath}/discussions`)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Go to Discussions
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          ← Back to Project
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Start New Discussion</h1>
          {project && (
            <p className="text-gray-600">Project: {project.title}</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discussion Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
              placeholder="What would you like to discuss?"
            />
            <p className="mt-1 text-xs text-gray-500">
              Be specific and descriptive to get better responses
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              name="content"
              rows="8"
              required
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none resize-none"
              placeholder="Describe your topic in detail. Include any relevant context, questions, or proposals..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Provide enough detail to help others understand and respond effectively
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Discussion'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
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

export default DiscussionCreate;