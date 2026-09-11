import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import projectApi from '../../api/projectApi';
import toast from 'react-hot-toast';
import { PageHeader } from '../common/PageHeader';
import { FolderKanban } from 'lucide-react';

const ProjectCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    course: '',
    semester: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error('Start date must be before end date');
      return;
    }

    setLoading(true);
    try {
      const response = await projectApi.createProject({
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      });
      toast.success('Project created successfully!');
      navigate(`/lecturer/projects/${response.data.projectId}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <PageHeader
        icon={FolderKanban}
        title="Create project"
        description="Set up a new academic project for your teams."
        actions={
          <button type="button" onClick={() => navigate('/lecturer/projects')} className="btn-secondary">
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
              value={formData.title}
              onChange={handleChange}
              className="field"
              placeholder="Enter project title"
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
              placeholder="Describe your project"
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
                placeholder="e.g., Software Engineering"
              />
            </div>
            <div>
              <label className="label">Semester *</label>
              <input
                type="text"
                name="semester"
                required
                value={formData.semester}
                onChange={handleChange}
                className="field"
                placeholder="e.g., Fall 2026"
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
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Creating...' : 'Create project'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/lecturer/projects')}
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

export default ProjectCreate;
