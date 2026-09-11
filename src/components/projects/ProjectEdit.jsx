import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import projectApi from '../../api/projectApi';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';
import { PageHeader } from '../common/PageHeader';
import { FolderKanban } from 'lucide-react';

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
    <div className="max-w-3xl">
      <PageHeader
        icon={FolderKanban}
        title="Edit project"
        description="Update project information."
        actions={
          <button
            type="button"
            onClick={() => navigate(`/lecturer/projects/${projectId}`)}
            className="btn-secondary"
          >
            Cancel
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="surface p-5 sm:p-6 mt-5 space-y-5">
        <div className="space-y-6">
          <div>
            <label className="label">Project title *</label>
            <input
              type="text"
              name="title"
              required
              minLength={3}
              maxLength={100}
              value={formData.title}
              onChange={handleChange}
              className="field"
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              rows="4"
              maxLength={1000}
              value={formData.description}
              onChange={handleChange}
              className="field"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Course *</label>
              <input
                type="text"
                name="course"
                required
                value={formData.course}
                onChange={handleChange}
                className="field"
              />
            </div>
            <div>
              <label className="label">Semester *</label>
              <input
                type="text"
                name="semester"
                required
                maxLength={20}
                value={formData.semester}
                onChange={handleChange}
                className="field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Start date *</label>
              <input
                type="date"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleChange}
                className="field"
              />
            </div>
            <div>
              <label className="label">End date *</label>
              <input
                type="date"
                name="endDate"
                required
                value={formData.endDate}
                onChange={handleChange}
                className="field"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving...' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/lecturer/projects/${projectId}`)}
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

export default ProjectEdit;
