import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import projectApi from '../../api/projectApi';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const toDateInput = (value) => {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
};

const ProjectEdit = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    course: '',
    semester: ''
  });

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await projectApi.getProjectById(projectId);
      const project = response.data;
      setFormData({
        title: project.title || '',
        description: project.description || '',
        startDate: toDateInput(project.startDate),
        endDate: toDateInput(project.endDate),
        course: project.course || '',
        semester: project.semester || ''
      });
    } catch (error) {
      toast.error('Failed to load project');
      navigate('/lecturer/projects');
    } finally {
      setLoading(false);
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

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error('Start date must be before end date');
      return;
    }

    setSaving(true);
    try {
      await projectApi.updateProject(projectId, {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      });
      toast.success('Project updated successfully!');
      navigate(`/lecturer/projects/${projectId}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(`/lecturer/projects/${projectId}`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
          <p className="text-gray-600">Update project information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              required
              minLength={3}
              maxLength={100}
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              maxLength={1000}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course *
              </label>
              <input
                type="text"
                name="course"
                required
                value={formData.course}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester *
              </label>
              <input
                type="text"
                name="semester"
                required
                maxLength={20}
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                required
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/lecturer/projects/${projectId}`)}
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

export default ProjectEdit;
