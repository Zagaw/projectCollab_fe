import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import projectApi from '../../api/projectApi';
import ProjectCard from './ProjectCard';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { PageHeader, FilterChips } from '../common/PageHeader';
import toast from 'react-hot-toast';
import { FolderKanban, Plus } from 'lucide-react';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectApi.getMyProjects();
      setProjects(response.data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await projectApi.deleteProject(projectId);
      toast.success('Project deleted successfully');
      setProjects(projects.filter(p => p.projectId !== projectId));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete project');
    }
  };

  const filteredProjects = filter === 'ALL' 
    ? projects 
    : projects.filter(p => p.status === filter);

  return (
    <div className="space-y-5">
      <PageHeader
        icon={FolderKanban}
        title="Projects"
        description="Create and manage academic projects your teams work on."
        actions={
          <Link to="/lecturer/projects/create" className="btn-primary">
            <Plus className="w-4 h-4" strokeWidth={2} />
            Create project
          </Link>
        }
      />

      <FilterChips
        value={filter}
        onChange={setFilter}
        options={[
          { id: 'ALL', label: 'All', count: projects.length },
          { id: 'ACTIVE', label: 'Active', count: projects.filter((p) => p.status === 'ACTIVE').length },
          { id: 'COMPLETED', label: 'Completed', count: projects.filter((p) => p.status === 'COMPLETED').length },
          { id: 'ON_HOLD', label: 'On hold', count: projects.filter((p) => p.status === 'ON_HOLD').length },
        ]}
      />

      {/* Projects Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No Projects Found"
          description="You haven't created any projects yet. Start by creating your first project."
          actionText="Create Project"
          actionLink="/lecturer/projects/create"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.projectId}
              project={project}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;